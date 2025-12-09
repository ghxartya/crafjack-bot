import type { Color as ColorModel } from '@/prisma/client'

import { prisma } from '@/lib/prisma'

export const Color = {
  async getAll() {
    return await prisma.color.findMany({
      orderBy: { name: 'asc' }
    })
  },

  async get(id: ColorModel['id']) {
    return await prisma.color.findUnique({
      where: { id }
    })
  },

  async append(name: ColorModel['name']) {
    return await prisma.color.upsert({
      where: { name },
      update: { name },
      create: { name }
    })
  }
}
