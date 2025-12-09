import type {
  Product as ProductModel,
  ProductStock as ProductStockModel
} from '@/prisma/client'

export type StockOperation = 'increment' | 'decrement'

export interface AdjustStockParams {
  productId: ProductStockModel['productId']
  sizeId: ProductStockModel['sizeId']
  quantity: ProductStockModel['quantity']
  operation: StockOperation
}

export interface CreateProductParams {
  name: ProductModel['name']
  categoryId: ProductModel['categoryId']
  colorId: ProductModel['colorId']
  comment: ProductModel['comment']
  cost: ProductModel['cost']
  costPrice: ProductModel['costPrice']
}
