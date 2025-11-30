import 'dotenv/config'
import { Scenes, Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import 'tsconfig-paths/register'

import { authMiddleware } from '@/middleware/auth'

import { buildKeyboard } from '@/keyboards'

import { BUTTONS } from '@/constants/buttons'
import { MESSAGES } from '@/constants/messages'

import { User } from '@/services/user'

import { terminal } from '@/helpers/cmd'

import authScene from '@/scenes/auth'
import ordersScene from '@/scenes/orders'
import shipmentsScene from '@/scenes/shipments'
import statisticsScene from '@/scenes/statistics'
import warehouseScene from '@/scenes/warehouse'

import type { MyContext } from '@/types'

import { isDev, launch, stop } from '@/utils/bot'

terminal.cmd(
  isDev ? 'dev' : 'start',
  isDev ? 'nodemon' : 'node dist/src',
  () => {
    const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!)
    const stage = new Scenes.Stage<MyContext>([
      authScene,
      warehouseScene,
      ordersScene,
      shipmentsScene,
      statisticsScene
    ])

    bot.use(
      session({
        defaultSession: () => ({
          __scenes: { cursor: 0, state: {} }
        })
      })
    )
    bot.use(stage.middleware())

    const { HOME } = MESSAGES
    const { MAIN } = BUTTONS.HOME

    bot.start(async ctx => {
      const name = ctx.from.first_name
      const telegramId = BigInt(ctx.from.id)

      const isAuthenticated = await User.isAuthenticated(telegramId)

      if (isAuthenticated)
        await ctx.reply(
          HOME.WELCOME(name, isAuthenticated),
          buildKeyboard(MAIN)
        )
      else {
        await ctx.reply(HOME.WELCOME(name, isAuthenticated))
        return ctx.scene.enter('auth')
      }
    })
    bot.use(authMiddleware)

    bot.hears(MAIN.SHIPMENTS, ctx => ctx.scene.enter('shipments'))
    bot.hears(MAIN.ORDERS, ctx => ctx.scene.enter('orders'))
    bot.hears(MAIN.STATISTICS, ctx => ctx.scene.enter('statistics'))
    bot.hears(MAIN.WAREHOUSE, ctx => ctx.scene.enter('warehouse'))

    bot.on(
      message('text'),
      async ctx => await ctx.reply(HOME.WARNING, buildKeyboard(MAIN))
    )

    launch(bot)
    stop(bot)
  },
  { start: true }
)
