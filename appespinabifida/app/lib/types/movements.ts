export type MovementType = 'in' | 'out'

export type MovementItemType = 'Material Médico' | 'Equipo Médico' | 'Medicamento' | 'Consumible'

export type InventoryMovement = {
  id: number
  itemName: string
  itemType: MovementItemType
  date: string // YYYY-MM-DD
  movementType: MovementType
  quantity: number
  notes: string
}

export type ListMovementsParams = {
  search?: string
  movementType?: MovementType | 'all'
  itemType?: MovementItemType | 'all'
  date?: string // YYYY-MM-DD
  cursor?: string | null
  limit?: number
}

export type ListMovementsResult = {
  items: InventoryMovement[]
  nextCursor: string | null
}

export type CreateMovementInput = {
  itemName: string
  itemType: MovementItemType
  date: string // YYYY-MM-DD
  movementType: MovementType
  quantity: number
  notes: string
}

