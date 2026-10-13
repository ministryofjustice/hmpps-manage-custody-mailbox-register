/* eslint-disable max-classes-per-file */
const childProcess = require('node:child_process')
const { cpSync, existsSync, globSync, mkdirSync, rmSync, statSync, watch } = require('node:fs')
const path = require('node:path')
const { styleText } = require('node:util')

const emojis = {
  checkmark: '\u{2705}',
  crossmark: '\u{274C}',
  eyes: '\u{1F440}',
  cyclone: '\u{1F300}',
  rocket: '\u{1F680}',
  cog: '\u{2699}\u{FE0F}',
}

function makePrefix(label, color) {
  return styleText(['bold', color], `[${label}]`)
}

function createPrefixedLineWriter(label, color, writeFn) {
  let buffer = ''
  let activeAnsiState = ''
  const prefix = makePrefix(label, color)

  // eslint-disable-next-line no-control-regex
  const ansiRegex = /\u001b\[[0-9;]*m/g

  function write(data) {
    buffer += typeof data === 'string' ? data : data.toString()

    const parts = buffer.split(/\r\n|\n|\r/)
    buffer = parts.pop() || ''
    if (parts.length === 0) return true

    const body = parts
      .map(line => {
        const lineWithState = activeAnsiState + line
        const matches = line.match(ansiRegex)

        if (matches) {
          matches.forEach(code => {
            activeAnsiState = code === '\u001b[0m' ? '' : code
          })
        }

        return `${prefix} ${lineWithState}\n`
      })
      .join('')

    return writeFn(body, 'utf8')
  }

  function flush() {
    if (buffer.length) {
      writeFn(`${prefix} ${activeAnsiState}${buffer}\n`, 'utf8')
      buffer = ''
      activeAnsiState = ''
    }
  }

  return { write, flush }
}

function spawnPrefixed(command, args, { label, color, ipc = false }) {
  const child = childProcess.spawn(command, args, {
    stdio: ['inherit', 'pipe', 'pipe', ...(ipc ? ['ipc'] : [])],
  })

  const destStdout = process.stdout.write.bind(process.stdout)
  const destStderr = process.stderr.write.bind(process.stderr)

  if (child.stdout) {
    const outWriter = createPrefixedLineWriter(label, color, destStdout)
    child.stdout.on('data', outWriter.write)
    child.stdout.on('end', outWriter.flush)
    child.on('close', outWriter.flush)
  }

  if (child.stderr) {
    const errWriter = createPrefixedLineWriter(label, color, destStderr)
    child.stderr.on('data', errWriter.write)
    child.stderr.on('end', errWriter.flush)
    child.on('close', errWriter.flush)
  }

  return child
}

function getGlobBase(pattern) {
  const recursiveIndex = pattern.indexOf('/**')
  if (recursiveIndex !== -1) {
    return pattern.slice(0, recursiveIndex)
  }

  const wildcardIndex = pattern.search(/[*?[{]/)
  return wildcardIndex === -1 ? pattern : path.dirname(pattern.slice(0, wildcardIndex))
}

function copyMatchedAssets(assets = []) {
  assets.forEach(({ from, to }) => {
    const baseDir = getGlobBase(from)
    rmSync(to, { force: true, recursive: true })

    globSync(from).forEach(sourcePath => {
      if (!existsSync(sourcePath) || !statSync(sourcePath).isFile()) {
        return
      }

      const relativePath = path.relative(baseDir, sourcePath)
      const targetPath = path.join(to, relativePath)
      mkdirSync(path.dirname(targetPath), { recursive: true })
      cpSync(sourcePath, targetPath, { force: true })
    })
  })
}

function copyPlugin(assets = [], { restartOnChange = false } = {}) {
  return {
    name: 'copy',
    setup(build) {
      build.onStart(() => {
        copyMatchedAssets(assets)
      })

      const watchedDirs = [...new Set(assets.filter(asset => asset.watch).map(asset => getGlobBase(asset.from)))]
      watchedDirs.forEach(directory => {
        let timeout
        watch(directory, { recursive: true }, () => {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            copyMatchedAssets(assets)
            if (restartOnChange && typeof process.send === 'function') {
              process.send({ type: 'app-build-complete' })
            }
          }, 100)
        })
      })
    },
  }
}

function cleanPlugin(patterns = []) {
  return {
    name: 'clean',
    setup(build) {
      if (patterns.length === 0) {
        return
      }

      build.onStart(() => {
        patterns.forEach(pattern => {
          globSync(pattern).forEach(target => {
            rmSync(target, { force: true, recursive: true })
          })

          if (existsSync(pattern)) {
            rmSync(pattern, { force: true, recursive: true })
          }
        })
      })
    },
  }
}

function buildNotificationPlugin(buildName, isWatchMode) {
  return {
    name: 'build-notification',
    setup(build) {
      build.onStart(() => {
        process.stderr.write(`${styleText('bold', `${emojis.cyclone} Building ${buildName}...`)}\n`)
      })

      build.onEnd(result => {
        if (result.errors.length === 0) {
          process.stderr.write(`${styleText('bold', `${emojis.rocket} ${buildName} build complete!`)}\n`)

          if (isWatchMode && typeof process.send === 'function') {
            process.send({ type: 'app-build-complete' })
          }
        } else {
          process.stderr.write(`${styleText('bold', `${emojis.crossmark} ${buildName} build failed`)}\n`)
        }
      })
    },
  }
}

class ESBuildManager {
  constructor(options = {}) {
    this.watchProcess = null
    this.options = {
      label: 'ESBuild',
      color: 'magenta',
      onBuildComplete: options.onBuildComplete || null,
    }
  }

  start(isWatchMode) {
    const args = ['esbuild/runner.js']

    if (isWatchMode) {
      args.push('--watch')
    }

    this.watchProcess = spawnPrefixed('node', args, {
      label: this.options.label,
      color: this.options.color,
      ipc: true,
    })

    this.watchProcess.on('message', msg => {
      if (msg.type === 'app-build-complete' && this.options.onBuildComplete) {
        this.options.onBuildComplete()
      }
    })

    this.watchProcess.on('exit', (code, signal) => {
      if (code !== null && code !== 0 && signal !== 'SIGTERM' && signal !== 'SIGINT') {
        process.exit(code)
      }
    })
  }
}

class ServerManager {
  constructor(options = {}) {
    this.serverProcess = null
    this.restartPromise = null
    this.options = {
      label: 'Node',
      color: 'green',
      ...options,
    }
  }

  restart() {
    if (!this.restartPromise) {
      this.restartPromise = this.restartServer().finally(() => {
        this.restartPromise = null
      })
    }
    return this.restartPromise
  }

  async restartServer() {
    if (this.serverProcess) {
      const isAlive = this.serverProcess.exitCode === null && this.serverProcess.signalCode === null

      if (isAlive) {
        await new Promise(resolve => {
          this.serverProcess.once('exit', resolve)
          this.serverProcess.kill()
        })
      }

      this.serverProcess = null
    }

    const nodeArgs = [
      ...(this.options.envFile ? [`--env-file=${this.options.envFile}`] : []),
      '--enable-source-maps',
      'dist/server.js',
    ]

    this.serverProcess = spawnPrefixed('node', nodeArgs, {
      label: this.options.label,
      color: this.options.color,
    })
  }
}

function getEnvFile(args) {
  const index = args.findIndex(arg => arg === '--env' || arg.startsWith('--env='))
  if (index === -1) return '.env'

  const value = args[index].slice(6) || args[index + 1]
  return value && !value.startsWith('--') ? value : '.env'
}

module.exports = {
  emojis,
  getEnvFile,
  copyPlugin,
  cleanPlugin,
  buildNotificationPlugin,
  ESBuildManager,
  ServerManager,
}
