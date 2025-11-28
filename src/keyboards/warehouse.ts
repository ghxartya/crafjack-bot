import { Markup } from 'telegraf'

import { BACK_BUTTON, MAIN_BUTTONS } from '@/constants/warehouse'

const keys = Object.keys(MAIN_BUTTONS)
const buttons = Object.values(MAIN_BUTTONS)

export const mainKeyboard = Markup.inlineKeyboard(
  buttons.map((text, index) => Markup.button.callback(text, keys[index])),
  { columns: 2 }
)

const backKey = Object.keys(BACK_BUTTON)[0]
const backButton = Object.values(BACK_BUTTON)[0]

export const backKeyboard = Markup.inlineKeyboard([
  Markup.button.callback(backButton, backKey)
])
