import { Category } from '@/services/category'
import { Color } from '@/services/color'
import { Product } from '@/services/product'
import { Size } from '@/services/size'

import type {
  Product as ProductModel,
  ProductStock as ProductStockModel
} from '@/prisma/client'

import type { KeyboardButtons } from '@/types'

export const getCategoryButtons = async () => {
  const categories = await Category.getAll()
  const buttons = categories.map(({ id, name }) => [id.toString(), name])
  return {
    length: buttons.length,
    buttons: Object.fromEntries(buttons) as KeyboardButtons
  }
}

export const getColorButtons = async () => {
  const colors = await Color.getAll()
  const buttons = colors.map(({ id, name }) => [id.toString(), name])
  return {
    length: buttons.length,
    buttons: Object.fromEntries(buttons) as KeyboardButtons
  }
}

export const getProductButtons = async (
  categoryId: ProductModel['categoryId']
) => {
  const products = await Product.getProductsByCategory(categoryId)
  const buttons = products.map(({ id, name, color }) => [
    id.toString(),
    `${name} (${color.name})`
  ])
  return {
    length: buttons.length,
    buttons: Object.fromEntries(buttons) as KeyboardButtons
  }
}

export const getProductStockButtons = async (
  productId: ProductStockModel['productId']
) => {
  const [product, sizes] = [await Product.get(productId), await Size.getAll()]
  const { name, color, stocks } = product!

  const stock = new Map(
    stocks.map(({ sizeId, quantity }) => [sizeId, quantity])
  )

  const buttons = sizes.map(({ id, name }) => [
    id.toString(),
    `${name}: ${stock.get(id) ?? 0} шт.`
  ])

  const text =
    `📋 ${name} (${color.name})\n<b>Количество:</b>\n` +
    sizes
      .map(({ id, name }) => `${name}: <b>${stock.get(id) ?? 0} шт.</b>`)
      .join('\n')

  return {
    text,
    buttons: Object.fromEntries(buttons) as KeyboardButtons
  }
}
