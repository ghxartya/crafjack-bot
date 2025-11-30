import { terminal } from '@/helpers/cmd'

import type { Bot } from '@/types'

export function launch(bot: Bot) {
  const errorMessage =
    'An error occured during post-launch process with reason —'

  if (process.env.ENV_NAME === 'production') {
    terminal.inform('Running bot in webhook mode.')

    const domain = process.env.DOMAIN!
    const port = Number(process.env.PORT!)

    terminal.informValue(['Domain:', domain])
    terminal.informValue(['Port:', port])

    bot
      .launch({
        webhook: {
          secretToken: bot.secretPathComponent(),
          domain,
          port
        }
      })
      .catch((error: Error) => {
        terminal.failureValue([errorMessage, error.message])
        process.exit(1)
      })
  } else {
    terminal.inform('Running bot in polling mode.')

    bot.launch().catch((error: Error) => {
      terminal.failureValue([errorMessage, error.message])
      process.exit(1)
    })
  }

  terminal.success('Bot launched successfully!', {
    start: true
  })
}

export function stop(bot: Bot) {
  const shutdown = (signal: string) => {
    terminal.inform(`Received ${signal}. Shutting down ...`)
    bot.stop(signal)
  }

  process.once('SIGINT', () => shutdown('SIGINT'))
  process.once('SIGTERM', () => shutdown('SIGTERM'))

  if (isDev)
    terminal.cautionValue([
      'Bot is running, to stop the process —',
      'press Ctrl+C'
    ])
}

export const isDev = __filename.endsWith('.ts')
