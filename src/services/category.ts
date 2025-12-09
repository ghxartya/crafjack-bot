import type { Category as CategoryModel } from '@/prisma/client'

import { prisma } from '@/lib/prisma'

export const Category = {
  async getAll() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  },

  async get(id: CategoryModel['id']) {
    return await prisma.category.findUnique({
      where: { id }
    })
  },

  async append(name: CategoryModel['name']) {
    return await prisma.category.upsert({
      where: { name },
      update: { name },
      create: { name }
    })
  }
}
