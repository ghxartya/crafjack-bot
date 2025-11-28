import type { Colors } from 'picocolors/types'

type Message = string | number | boolean
type Messages = Message | Message[] | Error

type NewlineOption = boolean | { start?: boolean; end?: boolean }
type Style = Exclude<keyof Colors | 'symbol', 'isColorSupported'>

type Styles = null | Style | Style[]
type StyleOption = Styles | Styles[]

type TypeOption = 'log' | 'info' | 'warn' | 'error'
type Symbols = Record<TypeOption, string>

interface PrintOptions {
  newline?: NewlineOption
  style?: StyleOption
  type?: TypeOption
}

type Handler = () => Promise<void> | void
type Options = Omit<PrintOptions, 'type'>

export type { Handler, Messages, Options, PrintOptions, Symbols }
