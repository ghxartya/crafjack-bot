import pc from 'picocolors'

import type { Messages, PrintOptions, Symbols } from '../types'

const Symbols: Symbols = {
  log: '✓',
  info: '🛈',
  warn: '⚠',
  error: '✖'
}

function ensureArray<T>(value: T | T[]): T[] {
  if (Array.isArray(value)) return value
  else if (!value) return []
  else return [value]
}

export default function print(messages: Messages, options: PrintOptions = {}) {
  const { newline = false, style = null, type = 'log' } = options

  const msgs = ensureArray(messages)
  const stls = ensureArray(style)

  let result = ''
  if (typeof newline === 'object' ? newline.start : newline) result += '\n'

  msgs.forEach((msg, i) => {
    let text = String(msg)
    const styles = ensureArray(stls[i])

    const symbol = styles.includes('symbol')
    if (symbol) text = `${Symbols[type]} ${text}`

    for (const style of styles) {
      if (style === 'symbol') continue
      if (style) text = pc[style](text)
    }

    if (i > 0) text = ` ${text}`
    result += text
  })

  if (typeof newline === 'object' ? newline.end : newline) result += '\n'
  console[type](result)
}
