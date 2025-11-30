import type {
  Category as CategoryModel,
  Product as ProductModel,
  ProductStock as ProductStockModel
} from '@/prisma/client'

import { prisma } from '@/lib/prisma'

export const Product = {
  async getProductsByCategory(categoryId: CategoryModel['id']) {
    return await prisma.product.findMany({
      where: { categoryId },
      include: { color: true },
      orderBy: { name: 'asc' }
    })
  },

  async getProductStock(productId: ProductStockModel['id']) {
    return await prisma.productStock.findMany({
      where: { productId },
      include: { size: true },
      orderBy: { size: { name: 'asc' } }
    })
  },

  async adjustStock(
    productId: ProductStockModel['productId'],
    sizeId: ProductStockModel['sizeId'],
    quantity: ProductStockModel['quantity'],
    operation: 'increment' | 'decrement'
  ) {
    return await prisma.productStock.upsert({
      where: { productId_sizeId: { productId, sizeId } },
      update: { quantity: { [operation]: quantity } },
      create: { productId, sizeId, quantity }
    })
  },

  async createProduct(
    name: ProductModel['name'],
    categoryId: ProductModel['categoryId'],
    colorId: ProductModel['colorId'],
    comment: ProductModel['comment'],
    cost: ProductModel['cost'],
    costPrice: ProductModel['costPrice']
  ) {
    return await prisma.product.create({
      data: { name, categoryId, colorId, comment, cost, costPrice }
    })
  },

  async deleteProduct(id: ProductModel['id']) {
    await prisma.productStock.deleteMany({ where: { productId: id } })
    return await prisma.product.delete({ where: { id } })
  }
}
