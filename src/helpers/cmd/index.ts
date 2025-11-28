import print from './script'
import type { Handler, Messages, Options } from './types'

export const terminal = {
  // *---*---*---*---*---*---*---*---*---*---*---*---*
  // | Terminal wrapper: describes specified command |
  // *---*---*---*---*---*---*---*---*---*---*---*---*
  cmd: async (
    name: string,
    command: string,
    handler: Handler,
    newline?: Options['newline']
  ) => {
    // *---*---*---*---*---*---*---*---*---*---*---*
    // | Indicates the start of command execution! |
    // *---*---*---*---*---*---*---*---*---*---*---*
    terminal.log([`Running ${name} command`, `\`${command}\``, '...'], {
      style: [null, 'italic'],
      newline
    })
    try {
      // *---*---*---*---*---*---*---*---*---*---*
      await handler() // Handles command logic ✓ |
      // *---*---*---*---*---*---*---*---*---*---*
      terminal.log(`The ${name} command has been executed.`, {
        newline
      })
    } catch (error) {
      const message = `An error occurred while running the ${name} command:`
      terminal.failure(message, newline)
      // *---*---*---*---*---*---*---*---*---*---*
      // | Indicates whether an error occurred × |
      // *---*---*---*---*---*---*---*---*---*---*
      terminal.failureMessage(error)
      process.exit(1)
    }
  },
  // *---*---*---*---*---*---*---*---*---*---*---*
  // | Helpers for printing logs     console.log |
  // *---*---*---*---*---*---*---*---*---*---*---*
  log: (msgs: Messages, opts?: Options) =>
    print(msgs, { ...opts, type: 'log' }),
  success: (msgs: Messages, newline?: Options['newline']) =>
    terminal.log(msgs, {
      style: [['green', 'symbol']],
      newline
    }),
  successValue: (msgs: Messages, newline?: Options['newline']) =>
    terminal.log(msgs, {
      style: [
        ['green', 'symbol'],
        ['yellow', 'bold']
      ],
      newline
    }),
  // *---*---*---*---*---*---*---*---*---*---*---*
  // | Helpers for printing logs    console.info |
  // *---*---*---*---*---*---*---*---*---*---*---*
  info: (msgs: Messages, opts?: Options) =>
    print(msgs, { ...opts, type: 'info' }),
  inform: (msgs: Messages, newline?: Options['newline']) =>
    terminal.info(msgs, {
      style: [['blue', 'symbol']],
      newline
    }),
  informValue: (msgs: Messages, newline?: Options['newline']) =>
    terminal.info(msgs, {
      style: [
        ['blue', 'symbol'],
        ['yellow', 'bold']
      ],
      newline
    }),
  // *---*---*---*---*---*---*---*---*---*---*---*
  // | Helpers for printing logs    console.warn |
  // *---*---*---*---*---*---*---*---*---*---*---*
  warn: (msgs: Messages, opts?: Options) =>
    print(msgs, { ...opts, type: 'warn' }),
  caution: (msgs: Messages, newline?: Options['newline']) =>
    terminal.warn(msgs, {
      style: [['yellow', 'symbol']],
      newline
    }),
  cautionValue: (msgs: Messages, newline?: Options['newline']) =>
    terminal.warn(msgs, {
      style: [
        ['yellow', 'symbol'],
        ['yellow', 'bold']
      ],
      newline
    }),
  // *---*---*---*---*---*---*---*---*---*---*---*
  // | Helpers for printing logs   console.error |
  // *---*---*---*---*---*---*---*---*---*---*---*
  error: (msgs: Messages, opts?: Options) =>
    print(msgs, { ...opts, type: 'error' }),
  failure: (msgs: Messages, newline?: Options['newline']) =>
    terminal.error(msgs, {
      style: [['redBright', 'bold', 'symbol']],
      newline
    }),
  failureValue: (msgs: Messages, newline?: Options['newline']) =>
    terminal.error(msgs, {
      style: [['redBright', 'bold', 'symbol'], ['red']],
      newline
    }),
  // *---*---*---*---*---*---*---*---*---*---*---*---*
  // | Helpers for printing logs   console.error msg |
  // *---*---*---*---*---*---*---*---*---*---*---*---*
  failureMessage: (err: unknown, newline?: Options['newline']) =>
    terminal.error(err as Error, {
      style: 'red',
      newline
    })
}
