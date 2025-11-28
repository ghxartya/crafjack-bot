import type {
  Category as CategoryModel,
  Product as ProductModel,
  ProductStock as ProductStockModel
} from '@/prisma/client'

import { prisma } from '@/lib/prisma'

export const Product = {
  async getProductsByCategory(categoryId: CategoryModel['id']) {
    return prisma.product.findMany({
      where: { categoryId },
      orderBy: { name: 'asc' }
    })
  },

  async getProductStock(productId: ProductStockModel['id']) {
    return prisma.productStock.findMany({
      where: { productId },
      orderBy: { size: { name: 'asc' } }
    })
  },

  async adjustStock(
    productId: ProductStockModel['productId'],
    sizeId: ProductStockModel['sizeId'],
    quantity: ProductStockModel['quantity']
  ) {
    return prisma.productStock.upsert({
      where: { productId_sizeId: { productId, sizeId } },
      update: { quantity: { increment: quantity } },
      create: { productId, sizeId, quantity }
    })
  },

  async deleteProduct(id: ProductModel['id']) {
    await prisma.productStock.deleteMany({ where: { productId: id } })
    return prisma.product.delete({ where: { id } })
  }
}
