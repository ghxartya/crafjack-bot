import type { Message } from 'telegraf/types'

import type { MyContext } from '@/types'

import { prisma } from '@/lib/prisma'

export async function authMiddleware(
  ctx: MyContext,
  next: () => Promise<void>
) {
  if ((ctx.message as Message.TextMessage)?.text === '/start') return next()

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(ctx.from!.id) }
  })

  if (!user?.isAuthenticated) return ctx.scene.enter('auth')
  return next()
}
