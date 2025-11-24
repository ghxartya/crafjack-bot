import type { Bot } from '@/types'

export function launch(bot: Bot) {
  if (process.env.ENV_NAME === 'production') {
    console.log('Running bot in production mode...')
    bot.launch()
  } else {
    console.log('Running bot in development mode...')
    bot.launch()
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
