import dotenv from 'dotenv'
import { Scenes, Telegraf, session } from 'telegraf'
import { message } from 'telegraf/filters'
import 'tsconfig-paths/register'

import { authMiddleware } from '@/middleware/auth'

import { mainKeyboard } from '@/keyboards'

import { MAIN_BUTTONS } from '@/constants'

import authScene from '@/scenes/authScene'

import type { MyContext } from '@/types'

dotenv.config()

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!)
const stage = new Scenes.Stage<MyContext>([authScene])

bot.use(
  session({
    defaultSession: () => ({
      __scenes: { cursor: 0, state: {} }
    })
  })
)
bot.use(stage.middleware())

bot.start(async ctx => {
  await ctx.reply(`👋 @${ctx.from.username}`)
  return ctx.scene.enter('auth')
})
bot.use(authMiddleware)

bot.hears(MAIN_BUTTONS.SHIPMENTS, ctx => ctx.reply('Отправки - soon'))
bot.hears(MAIN_BUTTONS.ORDERS, ctx => ctx.reply('Заказы - soon'))
bot.hears(MAIN_BUTTONS.WAREHOUSE, ctx => ctx.reply('Склад - soon'))
bot.hears(MAIN_BUTTONS.STATISTICS, ctx => ctx.reply('Статистика - soon'))

bot.on(message('text'), ctx => ctx.reply('Используйте меню ниже', mainKeyboard))
bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
