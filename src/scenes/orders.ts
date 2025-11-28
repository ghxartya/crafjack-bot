import { Scenes } from 'telegraf'

import { MAIN_BUTTONS } from '@/constants'

import type { MyContext } from '@/types'

const ordersScene = new Scenes.WizardScene<MyContext>('orders', async ctx => {
  await ctx.reply(`${MAIN_BUTTONS.ORDERS} — выберите действие:`)
  return ctx.wizard.next()
})

export default ordersScene
