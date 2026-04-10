export type InventoryStatus = 'in_stock' | 'out_of_stock'

export type InventoryItem = {
  id: number
  name: string
  categoryId: string
  categoryName: string
  description: string
  quantity: number
  status: InventoryStatus
}

export type Category = {
  id: string
  name: string
}

export type ListInventoryParams = {
  search?: string
  categoryId?: string
  cursor?: string | null
  limit?: number
}

export type ListInventoryResult = {
  items: InventoryItem[]
  nextCursor: string | null
}

export type CreateProductInput = {
  name: string
  categoryId: string
  description: string
  quantity: number
  status: InventoryStatus
}

