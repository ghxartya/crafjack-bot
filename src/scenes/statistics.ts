import { Scenes } from 'telegraf'

import { MAIN_BUTTONS } from '@/constants'

import type { MyContext } from '@/types'

const statisticsScene = new Scenes.WizardScene<MyContext>(
  'statistics',
  async ctx => {
    await ctx.reply(`${MAIN_BUTTONS.STATISTICS} — выберите действие:`)
    return ctx.wizard.next()
  }
)

export default statisticsScene
