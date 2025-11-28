import type { Size as SizeModel } from '@/prisma/client'

import { prisma } from '@/lib/prisma'

export const Size = {
  async getAll() {
    return await prisma.size.findMany({
      orderBy: { name: 'asc' }
    })
  },

  async append(name: SizeModel['name']) {
    return await prisma.size.upsert({
      where: { name },
      update: { name },
      create: { name }
    })
  }
}
