import { Scenes } from 'telegraf'

import { MESSAGES } from '@/constants/messages'

import type { MyContext } from '@/types'

const { ORDERS } = MESSAGES

const ordersScene = new Scenes.WizardScene<MyContext>('orders', async ctx => {
  await ctx.reply(ORDERS.ENTRANCE)
  return ctx.wizard.next()
})

export default ordersScene
