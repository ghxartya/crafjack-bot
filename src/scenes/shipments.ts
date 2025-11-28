import { Scenes } from 'telegraf'

import { MAIN_BUTTONS } from '@/constants'

import type { MyContext } from '@/types'

const shipmentsScene = new Scenes.WizardScene<MyContext>(
  'shipments',
  async ctx => {
    await ctx.reply(`${MAIN_BUTTONS.SHIPMENTS} — выберите действие:`)
    return ctx.wizard.next()
  }
)

export default shipmentsScene
