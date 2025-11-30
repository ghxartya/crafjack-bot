import { message } from 'telegraf/filters'

import { User } from '@/services/user'

import type { MyContext } from '@/types'

export async function authMiddleware(
  ctx: MyContext,
  next: () => Promise<void>
) {
  const telegramId = BigInt(ctx.from!.id)
  if (ctx.has(message('text')) && ctx.message.text === '/start') return next()

  const isAuthenticated = await User.isAuthenticated(telegramId)

  if (isAuthenticated) return next()
  else return ctx.scene.enter('auth')
}
