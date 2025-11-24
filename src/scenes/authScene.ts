import { Scenes } from 'telegraf'
import { message } from 'telegraf/filters'

import { cancelKeyboard, mainKeyboard, removeKeyboard } from '@/keyboards'

import { CANCEL_BUTTON } from '@/constants'

import { UserService } from '@/services/userService'

import type { MyContext } from '@/types'

const authScene = new Scenes.WizardScene<MyContext>(
  'auth',
  async ctx => {
    await ctx.reply('Введите пароль для доступа к CRM:', cancelKeyboard)
    return ctx.wizard.next()
  },
  async ctx => {
    if (!ctx.has(message('text'))) {
      await ctx.reply('⚠️ Пожалуйста, отправьте пароль в текстовом сообщении.')
      return
    }

    const password = ctx.message.text
    const telegramId = BigInt(ctx.from.id)

    if (password === CANCEL_BUTTON) {
      await ctx.reply(
        '⚠️ Авторизация отменена. Нажмите /start для повторной попытки.',
        removeKeyboard
      )
      return ctx.scene.leave()
    }

    if (password === process.env.AUTH_PASSWORD) {
      await UserService.authenticate(telegramId)
      await ctx.reply('✅ Авторизация прошла успешно!', mainKeyboard)
      return ctx.scene.leave()
    } else {
      await ctx.reply('❌ Неверный пароль. Попробуйте ещё раз:')
      return ctx.wizard.selectStep(1)
    }
  }
)

export default authScene
