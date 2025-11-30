import { Scenes } from 'telegraf'

import { MESSAGES } from '@/constants/messages'

import type { MyContext } from '@/types'

const { SHIPMENTS } = MESSAGES

const statisticsScene = new Scenes.WizardScene<MyContext>(
  'statistics',
  async ctx => {
    await ctx.reply(SHIPMENTS.ENTRANCE)
    return ctx.wizard.next()
  }
)

export default statisticsScene
