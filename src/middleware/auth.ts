import { message } from 'telegraf/filters'

import { UserService } from '@/services/userService'

import type { MyContext } from '@/types'

export async function authMiddleware(
  ctx: MyContext,
  next: () => Promise<void>
) {
  const telegramId = BigInt(ctx.from!.id)
  if (ctx.has(message('text')) && ctx.message.text === '/start') return next()

  if (await UserService.isAuthenticated(telegramId)) return next()
  else return ctx.scene.enter('auth')
}
