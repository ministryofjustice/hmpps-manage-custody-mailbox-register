const childProcess = require('node:child_process')
const { EventEmitter } = require('node:events')
const { ServerManager } = require('./utils')

describe('ServerManager', () => {
  let spawn
  let children

  beforeEach(() => {
    children = []
    spawn = jest.spyOn(childProcess, 'spawn').mockImplementation(() => {
      const child = new EventEmitter()
      child.exitCode = null
      child.signalCode = null
      child.kill = jest.fn(() => {
        queueMicrotask(() => {
          child.signalCode = 'SIGTERM'
          child.emit('exit', null, 'SIGTERM')
        })
        return true
      })
      children.push(child)
      return child
    })
  })

  afterEach(() => {
    spawn.mockRestore()
  })

  it('starts the server with the configured environment file', async () => {
    const manager = new ServerManager({ envFile: 'feature.env' })

    await manager.restart()

    expect(spawn).toHaveBeenCalledWith('node', ['--env-file=feature.env', '--enable-source-maps', 'dist/server.js'], {
      stdio: ['inherit', 'pipe', 'pipe'],
    })
    expect(manager.serverProcess).toBe(children[0])
  })

  it('coalesces concurrent restarts and permits a later restart', async () => {
    const manager = new ServerManager()
    await manager.restart()

    await Promise.all([manager.restart(), manager.restart(), manager.restart()])

    expect(spawn).toHaveBeenCalledTimes(2)
    expect(children[0].kill).toHaveBeenCalledTimes(1)
    expect(manager.serverProcess).toBe(children[1])

    await manager.restart()

    expect(spawn).toHaveBeenCalledTimes(3)
    expect(children[1].kill).toHaveBeenCalledTimes(1)
    expect(manager.serverProcess).toBe(children[2])
  })

  it('replaces an exited server without waiting for another exit event', async () => {
    const manager = new ServerManager()
    await manager.restart()
    children[0].exitCode = 1

    await manager.restart()

    expect(children[0].kill).not.toHaveBeenCalled()
    expect(spawn).toHaveBeenCalledTimes(2)
    expect(manager.serverProcess).toBe(children[1])
  })
})
