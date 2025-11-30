import { Scenes } from 'telegraf'
import { message } from 'telegraf/filters'

import { buildKeyboard, removeKeyboard } from '@/keyboards'

import { BUTTONS } from '@/constants/buttons'
import { MESSAGES } from '@/constants/messages'

import { User } from '@/services/user'

import type { MyContext } from '@/types'

const { AUTH } = MESSAGES
const { CANCEL, MAIN } = BUTTONS.HOME

const authScene = new Scenes.WizardScene<MyContext>(
  'auth',
  async ctx => {
    await ctx.reply(AUTH.ENTRANCE, buildKeyboard(CANCEL))
    return ctx.wizard.next()
  },
  async ctx => {
    if (!ctx.has(message('text'))) {
      await ctx.reply(AUTH.WARNING)
      return
    }

    const password = ctx.message.text
    const telegramId = BigInt(ctx.from.id)

    if (password === CANCEL.TEXT) {
      await ctx.reply(AUTH.CANCEL, removeKeyboard)
      return ctx.scene.leave()
    }

    if (password === process.env.AUTH_PASSWORD) {
      await User.authenticate(telegramId)
      await ctx.reply(AUTH.VALID, buildKeyboard(MAIN))
      return ctx.scene.leave()
    } else {
      await ctx.reply(AUTH.INVALID)
      return ctx.wizard.selectStep(1)
    }
  }
)

export default authScene
