import { Markup } from 'telegraf'

import { BACK_BUTTON, CANCEL_BUTTON, MAIN_BUTTONS } from '@/constants'

export const mainKeyboard = Markup.keyboard(Object.values(MAIN_BUTTONS), {
  columns: 2
}).resize()

export const backKeyboard = Markup.keyboard([BACK_BUTTON]).resize()
export const cancelKeyboard = Markup.keyboard([CANCEL_BUTTON])
  .resize()
  .oneTime()

export const removeKeyboard = Markup.removeKeyboard()
