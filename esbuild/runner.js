const esbuild = require('esbuild')
const { styleText } = require('node:util')
const { emojis } = require('./utils')
const { getAppConfig } = require('./app.config')
const { getAssetsConfig, getAdditionalAssetsConfig } = require('./assets.config')
const { getBuildConfig } = require('./build.config')

/**
 * Run ESBuild process, if `--watch` provided, run in watch mode.
 */
async function main() {
  const buildConfig = getBuildConfig()
  const appConfig = getAppConfig(buildConfig)
  const assetsConfig = getAssetsConfig(buildConfig)
  const additionalAssetsConfig = getAdditionalAssetsConfig(buildConfig)

  if (buildConfig.isWatchMode) {
    process.stderr.write(`${styleText('bold', `${emojis.eyes} Starting ESBuild watchers...`)}\n`)

    return Promise.all(
      [appConfig, assetsConfig, additionalAssetsConfig].map(async config => {
        const ctx = await esbuild.context(config)
        await ctx.watch()
      }),
    )
  }

  process.stderr.write(`${styleText('bold', `${emojis.cog} Starting ESBuild...`)}\n`)

  return Promise.all([
    esbuild.build(appConfig),
    esbuild.build(assetsConfig),
    esbuild.build(additionalAssetsConfig),
  ]).catch(error => {
    process.stderr.write(`${error}\n`)
    process.exit(1)
  })
}

main()
