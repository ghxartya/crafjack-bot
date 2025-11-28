import type { User as UserModel } from '@/prisma/client'

import { prisma } from '@/lib/prisma'

export const User = {
  async get(telegramId: UserModel['telegramId']) {
    return await prisma.user.findUnique({ where: { telegramId } })
  },

  async authenticate(telegramId: UserModel['telegramId']) {
    return await prisma.user.upsert({
      where: { telegramId },
      update: { isAuthenticated: true },
      create: { telegramId, isAuthenticated: true }
    })
  },

  async isAuthenticated(telegramId: UserModel['telegramId']) {
    const user = await this.get(telegramId)
    if (user) return user.isAuthenticated
    else return false
  }
}
