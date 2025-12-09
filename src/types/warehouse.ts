import { BUTTONS } from '@/constants/buttons'

import type { StockOperation } from './product'

export interface WarehouseSession {
  action?: keyof typeof BUTTONS.WAREHOUSE.MAIN
  categoryId?: number
  productId?: number
  sizeId?: number
  operation?: StockOperation
  step?:
    | 'name'
    | 'category'
    | 'color'
    | 'cost'
    | 'costPrice'
    | 'comment'
    | 'confirm_add'
    | 'confirm_edit'
    | 'confirm_delete'
    | 'choose_size'
    | 'choose_operation'
    | 'quantity'
  temp?: Partial<{
    name: string
    categoryId: number
    colorId: number
    cost: number
    costPrice: number
    comment: string
  }>
}
