import { Scenes } from 'telegraf'

import { buildInlineKeyboard } from '@/keyboards'

import { BUTTONS } from '@/constants/buttons'
import { MESSAGES } from '@/constants/messages'

import { Category } from '@/services/category'

import type { MyContext } from '@/types'

const { WAREHOUSE } = MESSAGES
const { MAIN } = BUTTONS.WAREHOUSE

const warehouseScene = new Scenes.WizardScene<MyContext>(
  'warehouse',
  async ctx => {
    await ctx.reply(WAREHOUSE.ENTRANCE, buildInlineKeyboard(MAIN))
    return ctx.wizard.next()
  }
)

const defaultKeys = Object.keys(MAIN)

warehouseScene.action(defaultKeys[0], async ctx => {
  const categories = await Category.getAll()
  const buttons = Object.fromEntries(
    categories.map(category => [category.id.toString(), category.name])
  )

  await ctx.reply(
    'Выберите категорию для просмотра количества:',
    buildInlineKeyboard(buttons, { columns: 3, prefix: 'CATEGORY' })
  )
})

export default warehouseScene
