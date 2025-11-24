import type { User } from '@/prisma/index'

import { prisma } from '@/lib/prisma'

export const UserService = {
  async get(telegramId: User['telegramId']) {
    return await prisma.user.findUnique({ where: { telegramId } })
  },

  async authenticate(telegramId: User['telegramId']) {
    return await prisma.user.upsert({
      where: { telegramId },
      update: { isAuthenticated: true },
      create: { telegramId, isAuthenticated: true }
    })
  },

  async isAuthenticated(telegramId: User['telegramId']) {
    const user = await this.get(telegramId)
    if (user) return user.isAuthenticated
    else return false
  }
}
