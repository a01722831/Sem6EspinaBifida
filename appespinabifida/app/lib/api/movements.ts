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
    itemName: 'Válvula de Derivación Ventrículo-Peritoneal',
    itemType: 'Equipo Médico',
    date: '2024-01-15',
    movementType: 'in',
    quantity: 5,
    notes: 'Entrada por donación',
  },
  {
    id: 47953,
    itemName: 'Catéter Vesical Pediátrico',
    itemType: 'Material Médico',
    date: '2024-02-20',
    movementType: 'out',
    quantity: 12,
    notes: 'Salida a pacientes',
  },
  {
    id: 47955,
    itemName: 'Andadera Ortopédica Infantil',
    itemType: 'Equipo Médico',
    date: '2024-03-10',
    movementType: 'in',
    quantity: 3,
    notes: '',
  },
  {
    id: 47957,
    itemName: 'Sondas Urinarias Calibre 8-12',
    itemType: 'Consumible',
    date: '2024-01-25',
    movementType: 'in',
    quantity: 50,
    notes: 'Reabastecimiento',
  },
  {
    id: 47959,
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
    date = '',
    cursor,
    limit = 6,
  } = params

  await sleep(220)

  const filtered = MOCK_MOVEMENTS.filter((m) => {
    const matchesSearch =
      !normalize(search) ||
      normalize(m.itemName).includes(normalize(search)) ||
      normalize(m.notes).includes(normalize(search))

    const matchesType =
      movementType === 'all' || !movementType || m.movementType === movementType

    const matchesItemType = itemType === 'all' || !itemType || m.itemType === itemType

    const matchesDate = !date || m.date === date

    return matchesSearch && matchesType && matchesItemType && matchesDate
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

  const trimmedName = input.itemName.trim()
  if (!trimmedName) throw new Error('Nombre inválido')
  if (!MOCK_ITEM_TYPES.includes(input.itemType)) throw new Error('Tipo inválido')

  const qty = Math.floor(Number(input.quantity))
  if (Number.isNaN(qty) || qty <= 0) throw new Error('Cantidad inválida')

  const m: InventoryMovement = {
    id: nextMockId++,
    itemName: trimmedName,
    itemType: input.itemType,
    date: input.date,
    movementType: input.movementType,
    quantity: qty,
    notes: input.notes.trim(),
  }

  MOCK_MOVEMENTS.unshift(m)
  return m
}

