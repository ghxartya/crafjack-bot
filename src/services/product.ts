import type { Product as ProductModel } from '@/prisma/client'

import type { AdjustStockParams, CreateProductParams } from '@/types/product'

import { prisma } from '@/lib/prisma'

export const Product = {
  async get(id: ProductModel['id']) {
    return await prisma.product.findUnique({
      where: { id },
      include: { color: true, stocks: true }
    })
  },

  async getProductsByCategory(categoryId: ProductModel['categoryId']) {
    return await prisma.product.findMany({
      where: { categoryId },
      include: { color: true },
      orderBy: { name: 'asc' }
    })
  },

  async adjustStock({
    productId,
    sizeId,
    quantity,
    operation
  }: AdjustStockParams) {
    if (operation === 'decrement') {
      const current = await prisma.productStock.findUnique({
        where: { productId_sizeId: { productId, sizeId } }
      })
      if (!current || current.quantity < quantity)
        throw new Error('Недостаточно товара на складе!')
    }
    return await prisma.productStock.upsert({
      where: { productId_sizeId: { productId, sizeId } },
      update: { quantity: { [operation]: quantity } },
      create: { productId, sizeId, quantity }
    })
  },

  async createProduct({
    name,
    categoryId,
    colorId,
    comment,
    cost,
    costPrice
  }: CreateProductParams) {
    const exists = await prisma.product.findFirst({
      where: { name, categoryId, colorId }
    })
    if (exists)
      throw new Error(
        'Товар с таким названием, категорией и цветом уже существует!'
      )
    return await prisma.product.create({
      data: { name, categoryId, colorId, comment, cost, costPrice }
    })
  },

  async deleteProduct(id: ProductModel['id']) {
    await prisma.productStock.deleteMany({ where: { productId: id } })
    return await prisma.product.delete({ where: { id } })
  }
}
