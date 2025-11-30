import { Markup } from 'telegraf'

import type { KeyboardButtons } from '@/types'

export function buildKeyboard(
  buttons: KeyboardButtons,
  options: {
    columns?: number
  } = {}
) {
  const { columns = 2 } = options
  const values = Object.values(buttons)
  return Markup.keyboard(values, { columns }).resize()
}

export function buildInlineKeyboard(
  buttons: KeyboardButtons,
  options: {
    columns?: number
    prefix?: string
  } = {}
) {
  const { columns = 1, prefix = '' } = options

  const keys = Object.keys(buttons)
  const values = Object.values(buttons)

  return Markup.inlineKeyboard(
    values.map((value, index) =>
      Markup.button.callback(
        value,
        prefix ? `${prefix}:` + keys[index] : keys[index]
      )
    ),
    { columns }
  )
}

export const removeKeyboard = Markup.removeKeyboard()
