import { Scenes } from 'telegraf'

import { mainKeyboard } from '@/keyboards/warehouse'

import { MAIN_BUTTONS } from '@/constants'

import type { MyContext } from '@/types'

const warehouseScene = new Scenes.WizardScene<MyContext>(
  'warehouse',
  async ctx => {
    await ctx.reply(
      `${MAIN_BUTTONS.WAREHOUSE} — выберите действие:`,
      mainKeyboard
    )
    return ctx.wizard.next()
  }
)

export default warehouseScene
