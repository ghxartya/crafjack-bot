import type { Bot } from '@/types'

export async function launch(bot: Bot) {
  if (process.env.ENV_NAME === 'production') {
    console.log('Running bot in production mode (webhook)...')
    await bot.launch({
      webhook: {
        domain: process.env.DOMAIN!,
        port: Number(process.env.PORT!),
        secretToken: bot.secretPathComponent()
      }
    })
  } else {
    console.log('Running bot in development mode (polling)...')
    void bot.launch()
  }
}

export function stop(bot: Bot) {
  const shutdown = (signal: string) => {
    console.log(`Received ${signal}. Shutting down...`)
    bot.stop(signal)
  }

  process.once('SIGINT', () => shutdown('SIGINT'))
  process.once('SIGTERM', () => shutdown('SIGTERM'))
}
