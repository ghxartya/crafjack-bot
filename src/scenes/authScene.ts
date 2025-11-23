import { Scenes } from 'telegraf'

import { mainKeyboard } from '@/keyboards'

import type { MyContext } from '@/types'

import { prisma } from '@/lib/prisma'

const authScene = new Scenes.WizardScene<MyContext>(
  'auth',
  async ctx => {
    await ctx.reply('Okay, give me your password.')
    return ctx.wizard.next()
  },
  async ctx => {
    const password = (ctx.message as { text: string })?.text?.trim()

    if (password === process.env.AUTH_PASSWORD) {
      await prisma.user.upsert({
        where: { telegramId: BigInt(ctx.from!.id) },
        update: { isAuthenticated: true },
        create: { telegramId: BigInt(ctx.from!.id), isAuthenticated: true }
      })

      await ctx.reply('Авторизация прошла успешно!', mainKeyboard)
      return ctx.scene.leave()
    } else {
      await ctx.reply('Неверный пароль. Попробуйте ещё раз:')
      return ctx.wizard.selectStep(1)
    }
  }
)

export default authScene
