const { typecheckPlugin } = require('@jgoz/esbuild-plugin-typecheck')
const { globSync } = require('node:fs')
const { buildNotificationPlugin, copyPlugin } = require('./utils')

/**
 * Build typescript application into CommonJS
 */
const getAppConfig = buildConfig => ({
  entryPoints: globSync(buildConfig.app.entryPoints),
  outdir: buildConfig.app.outDir,
  bundle: false,
  sourcemap: true,
  platform: 'node',
  format: 'cjs',
  plugins: [
    typecheckPlugin({ watch: buildConfig.isWatchMode }),
    copyPlugin(buildConfig.app.copy, { restartOnChange: true }),
    buildNotificationPlugin('App', buildConfig.isWatchMode),
  ],
})

module.exports = { getAppConfig }
