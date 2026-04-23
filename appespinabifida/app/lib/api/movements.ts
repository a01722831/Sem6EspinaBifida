import {
  categoryIdFromMovementItemType,
  createProduct,
  findInventoryItemByExactName,
  findSimilarInventoryItemsByName,
  getInventoryItemById,
  movementItemTypeFromCategoryId,
  updateInventoryQuantity,
} from './inventory'
import type {
  CreateMovementInput,
  InventoryMovement,
  ListMovementsParams,
  ListMovementsResult,
  MovementItemType,
} from '../types/movements'

const MOCK_ITEM_TYPES: MovementItemType[] = [
  'Material Médico',
  'Equipo Médico',
  'Medicamento',
  'Consumible',
]

const MOCK_MOVEMENTS: InventoryMovement[] = [
  {
    id: 47951,
    itemId: null,
    itemName: 'Válvula de Derivación Ventrículo-Peritoneal',
    itemType: 'Equipo Médico',
    date: '2024-01-15',
    movementType: 'in',
    quantity: 5,
    notes: 'Entrada por donación',
  },
  {
    id: 47953,
    itemId: null,
    itemName: 'Catéter Vesical Pediátrico',
    itemType: 'Material Médico',
    date: '2024-02-20',
    movementType: 'out',
    quantity: 12,
    notes: 'Salida a pacientes',
  },
  {
    id: 47955,
    itemId: null,
    itemName: 'Andadera Ortopédica Infantil',
    itemType: 'Equipo Médico',
    date: '2024-03-10',
    movementType: 'in',
    quantity: 3,
    notes: '',
  },
  {
    id: 47957,
    itemId: null,
    itemName: 'Sondas Urinarias Calibre 8-12',
    itemType: 'Consumible',
    date: '2024-01-25',
    movementType: 'in',
    quantity: 50,
    notes: 'Reabastecimiento',
  },
  {
    id: 47959,
    itemId: null,
    itemName: 'Silla de Ruedas Pediátrica',
    itemType: 'Equipo Médico',
    date: '2024-02-15',
    movementType: 'out',
    quantity: 2,
    notes: '',
  },
]

let nextMockId =
  MOCK_MOVEMENTS.reduce((max, it) => Math.max(max, it.id), 0) + 1

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function asPositiveQuantity(rawQuantity: number) {
  const quantity = Math.floor(Number(rawQuantity))
  if (Number.isNaN(quantity) || quantity <= 0) {
    throw new Error('Indica una cantidad válida (mayor a 0).')
  }
  return quantity
}

function formatSimilarList(names: string[]) {
  if (names.length === 0) return ''
  return names.join(', ')
}

export async function listMovementItemTypes(): Promise<MovementItemType[]> {
  await sleep(120)
  return MOCK_ITEM_TYPES
}

/**
 * Mock API shaped like a cursor-based backend.
 * Replace internals with a real fetch later.
 */
export async function listMovements(
  params: ListMovementsParams,
): Promise<ListMovementsResult> {
  const {
    search = '',
    movementType = 'all',
    itemType = 'all',
    itemId,
    itemName = '',
    date = '',
    cursor,
    limit = 6,
  } = params

  const normalizedItemName = normalize(itemName)

  await sleep(220)

  const filtered = MOCK_MOVEMENTS.filter((m) => {
    const matchesSearch =
      !normalize(search) ||
      normalize(m.itemName).includes(normalize(search)) ||
      normalize(m.notes).includes(normalize(search))

    const matchesType =
      movementType === 'all' || !movementType || m.movementType === movementType

    const matchesItemType = itemType === 'all' || !itemType || m.itemType === itemType

    const matchesItemReference =
      (!itemId && !normalizedItemName) ||
      (Boolean(itemId) && m.itemId === itemId) ||
      (Boolean(normalizedItemName) && normalize(m.itemName) === normalizedItemName)

    const matchesDate = !date || m.date === date

    return (
      matchesSearch &&
      matchesType &&
      matchesItemType &&
      matchesItemReference &&
      matchesDate
    )
  })

  const start = cursor ? Number(cursor) : 0
  const page = filtered.slice(start, start + limit)
  const nextCursor = start + limit < filtered.length ? String(start + limit) : null

  return { items: page, nextCursor }
}

/**
 * Mock create; replace with POST /inventory/movements later.
 */
export async function createMovement(
  input: CreateMovementInput,
): Promise<InventoryMovement> {
  await sleep(200)

  if (!MOCK_ITEM_TYPES.includes(input.itemType)) {
    throw new Error('Selecciona un tipo de artículo válido.')
  }

  const qty = asPositiveQuantity(input.quantity)

  let resolvedItem =
    input.itemId !== undefined ? await getInventoryItemById(input.itemId) : null

  const trimmedName = input.itemName.trim()

  if (!resolvedItem && trimmedName) {
    const exactByName = await findInventoryItemByExactName(trimmedName)
    if (exactByName) {
      resolvedItem = exactByName
    }
  }

  if (input.movementType === 'out' && !resolvedItem) {
    throw new Error('Para salida debes seleccionar un artículo existente.')
  }

  if (input.movementType === 'in' && !resolvedItem) {
    if (!trimmedName) {
      throw new Error('Indica el nombre del artículo.')
    }

    const similar = await findSimilarInventoryItemsByName(trimmedName, 4)
    if (similar.length > 0 && !input.allowSimilarCreate) {
      const similarNames = similar.map((item) => item.name)
      throw new Error(
        `Se encontraron artículos similares: ${formatSimilarList(similarNames)}. Selecciona una sugerencia o confirma crear uno nuevo.`,
      )
    }

    const created = await createProduct({
      name: trimmedName,
      categoryId: categoryIdFromMovementItemType(input.itemType),
      description: input.notes.trim() || 'Sin descripción',
      cuotaRecuperacion: null,
      quantity: 0,
      status: 'out_of_stock',
    })

    resolvedItem = created
  }

  if (!resolvedItem) {
    throw new Error('No se pudo resolver el artículo para registrar el movimiento.')
  }

  const stockDelta = input.movementType === 'in' ? qty : -qty
  const updatedInventoryItem = await updateInventoryQuantity(resolvedItem.id, stockDelta)

  const m: InventoryMovement = {
    id: nextMockId++,
    itemId: updatedInventoryItem.id,
    itemName: updatedInventoryItem.name,
    itemType: movementItemTypeFromCategoryId(updatedInventoryItem.categoryId),
    date: input.date,
    movementType: input.movementType,
    quantity: qty,
    notes: input.notes.trim(),
  }

  MOCK_MOVEMENTS.unshift(m)
  return m
}

