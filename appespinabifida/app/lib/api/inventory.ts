import type {
  Category,
  CreateProductInput,
  InventoryItem,
  InventoryStatus,
  ListInventoryParams,
  ListInventoryResult,
} from '../types/inventory'
import type { MovementItemType } from '../types/movements'

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todas las categorías' },
  { id: 'medicamento', name: 'Medicamento' },
  { id: 'material medico', name: 'Material Médico' },
  { id: 'equipo medico', name: 'Equipo Médico' },
  { id: 'consumible', name: 'Consumible' },
]

const LOW_STOCK_THRESHOLD = 5

const ITEM_TYPE_BY_CATEGORY_ID: Record<string, MovementItemType> = {
  medicamento: 'Medicamento',
  'material medico': 'Material Médico',
  'equipo medico': 'Equipo Médico',
  consumible: 'Consumible',
}

const CATEGORY_ID_BY_ITEM_TYPE: Record<MovementItemType, string> = {
  'Material Médico': 'material medico',
  'Equipo Médico': 'equipo medico',
  Medicamento: 'medicamento',
  Consumible: 'consumible',
}

let ITEMS: InventoryItem[] = []
let hydrated = false

let nextMockId =
  ITEMS.reduce((max, it) => Math.max(max, it.id), 0) + 1

function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function isInventoryStatus(value: unknown): value is InventoryStatus {
  return value === 'in_stock' || value === 'low_stock' || value === 'out_of_stock'
}

function deriveStatus(quantity: number): InventoryStatus {
  if (quantity <= 0) return 'out_of_stock'
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low_stock'
  return 'in_stock'
}

function toCategoryName(categoryId: string) {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  if (category) return category.name

  const compact = categoryId.replace(/\s+/g, ' ').trim()
  if (!compact) return 'Sin categoría'
  return `${compact.charAt(0).toUpperCase()}${compact.slice(1)}`
}

function asNonNegativeNumber(value: unknown, fallback: number) {
  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return fallback
  return Math.max(0, numberValue)
}

function mapIncomingItem(raw: Partial<InventoryItem> & { [key: string]: unknown }): InventoryItem {
  const id = Number(raw.id)
  const safeId = Number.isNaN(id) ? nextMockId++ : id

  const categoryId = String(raw.categoryId ?? raw.categoria ?? '').trim() || 'consumible'
  const quantity = Math.floor(asNonNegativeNumber(raw.quantity ?? raw.inventario_actual, 0))
  const quotaRaw = raw.cuotaRecuperacion ?? raw.cuota_recuperacion

  const quota =
    quotaRaw === undefined || quotaRaw === null
      ? null
      : Math.floor(asNonNegativeNumber(quotaRaw, 0) * 100) / 100

  const status = isInventoryStatus(raw.status) ? raw.status : deriveStatus(quantity)

  return {
    id: safeId,
    name: String(raw.name ?? raw.nombre ?? 'Sin nombre').trim(),
    categoryId,
    categoryName: String(raw.categoryName ?? toCategoryName(categoryId)),
    description: String(raw.description ?? raw.descripcion ?? '').trim(),
    cuotaRecuperacion: quota,
    quantity,
    status,
  }
}

function cloneItem(item: InventoryItem): InventoryItem {
  return { ...item }
}

function mergeWithExisting(remoteItems: InventoryItem[]) {
  const localById = new Map(ITEMS.map((item) => [item.id, item]))
  const mergedRemote = remoteItems.map((remote) => {
    const local = localById.get(remote.id)
    if (!local) return remote

    return {
      ...remote,
      cuotaRecuperacion: local.cuotaRecuperacion,
      quantity: local.quantity,
      status: local.status,
      description: local.description,
    }
  })

  const remoteIds = new Set(remoteItems.map((item) => item.id))
  const localOnly = ITEMS.filter((item) => !remoteIds.has(item.id))

  ITEMS = [...localOnly, ...mergedRemote]
  const maxId = ITEMS.reduce((max, item) => Math.max(max, item.id), 0)
  nextMockId = Math.max(nextMockId, maxId + 1)
}

async function hydrateInventory() {
  try {
    const res = await fetch('/api/inventario/obtener/inventario')
    if (!res.ok) {
      hydrated = true
      return
    }

    const data = (await res.json()) as Array<Partial<InventoryItem>>
    const remoteItems = data.map((item) => mapIncomingItem(item))
    mergeWithExisting(remoteItems)
    hydrated = true
  } catch {
    hydrated = true
  }
}

async function ensureInventoryReady() {
  if (hydrated) return
  await hydrateInventory()
}

function scoreSearchHit(itemName: string, normalizedQuery: string): number {
  const normalizedName = normalize(itemName)
  if (normalizedName === normalizedQuery) return 0
  if (normalizedName.startsWith(normalizedQuery)) return 1
  if (normalizedName.includes(normalizedQuery)) return 2
  return 3
}

function levenshteinDistance(a: string, b: string) {
  if (!a) return b.length
  if (!b) return a.length

  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0),
  )

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + substitutionCost,
      )
    }
  }

  return matrix[a.length][b.length]
}

export async function listCategories(): Promise<Category[]> {
  return CATEGORIES
}

export function categoryIdFromMovementItemType(itemType: MovementItemType) {
  return CATEGORY_ID_BY_ITEM_TYPE[itemType]
}

export function movementItemTypeFromCategoryId(categoryId: string): MovementItemType {
  return ITEM_TYPE_BY_CATEGORY_ID[normalize(categoryId)] ?? 'Consumible'
}

export async function getInventoryItemById(id: number): Promise<InventoryItem | null> {
  await ensureInventoryReady()
  const item = ITEMS.find((it) => it.id === id)
  return item ? cloneItem(item) : null
}

export async function getInventorySnapshot(): Promise<InventoryItem[]> {
  await ensureInventoryReady()
  return ITEMS.map(cloneItem)
}

export async function findInventoryItemByExactName(
  name: string,
): Promise<InventoryItem | null> {
  await ensureInventoryReady()
  const normalizedName = normalize(name)
  if (!normalizedName) return null
  const found = ITEMS.find((item) => normalize(item.name) === normalizedName)
  return found ? cloneItem(found) : null
}

export async function findSimilarInventoryItemsByName(
  name: string,
  limit = 5,
): Promise<InventoryItem[]> {
  await ensureInventoryReady()
  const normalizedName = normalize(name)
  if (!normalizedName) return []

  const matches = ITEMS.map((item) => {
    const normalizedItemName = normalize(item.name)
    const distance = levenshteinDistance(normalizedName, normalizedItemName)
    const maxLength = Math.max(normalizedName.length, normalizedItemName.length)
    const similarityThreshold = Math.max(1, Math.floor(maxLength * 0.25))
    const appearsSimilar =
      normalizedItemName.includes(normalizedName) ||
      normalizedName.includes(normalizedItemName) ||
      distance <= similarityThreshold

    return {
      item,
      appearsSimilar,
      distance,
      normalizedItemName,
    }
  })
    .filter((entry) => entry.appearsSimilar)
    .sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance
      return a.normalizedItemName.localeCompare(b.normalizedItemName)
    })
    .slice(0, limit)

  return matches.map((entry) => cloneItem(entry.item))
}

export async function searchInventoryItemsByName(
  query: string,
  limit = 8,
): Promise<InventoryItem[]> {
  await ensureInventoryReady()
  const normalizedQuery = normalize(query)

  const filtered = normalizedQuery
    ? ITEMS.filter((item) => {
        const normalizedName = normalize(item.name)
        return (
          normalizedName.includes(normalizedQuery) ||
          normalize(item.description).includes(normalizedQuery)
        )
      })
    : [...ITEMS]

  return filtered
    .sort((a, b) => {
      if (normalizedQuery) {
        const scoreA = scoreSearchHit(a.name, normalizedQuery)
        const scoreB = scoreSearchHit(b.name, normalizedQuery)
        if (scoreA !== scoreB) return scoreA - scoreB
      }

      return a.name.localeCompare(b.name)
    })
    .slice(0, limit)
    .map(cloneItem)
}

export async function updateInventoryItemQuota(
  itemId: number,
  cuotaRecuperacion: number | null,
): Promise<InventoryItem> {
  await ensureInventoryReady()

  const targetIndex = ITEMS.findIndex((item) => item.id === itemId)
  if (targetIndex < 0) {
    throw new Error('Artículo no encontrado')
  }

  const sanitizedQuota =
    cuotaRecuperacion === null
      ? null
      : Math.floor(asNonNegativeNumber(cuotaRecuperacion, 0) * 100) / 100

  const updated = {
    ...ITEMS[targetIndex],
    cuotaRecuperacion: sanitizedQuota,
  }

  ITEMS[targetIndex] = updated
  return cloneItem(updated)
}

export async function updateInventoryQuantity(
  itemId: number,
  delta: number,
): Promise<InventoryItem> {
  await ensureInventoryReady()

  const targetIndex = ITEMS.findIndex((item) => item.id === itemId)
  if (targetIndex < 0) {
    throw new Error('Artículo no encontrado')
  }

  const movementDelta = Math.floor(Number(delta))
  if (Number.isNaN(movementDelta)) {
    throw new Error('Cantidad inválida')
  }

  const current = ITEMS[targetIndex]
  const nextQuantity = current.quantity + movementDelta
  if (nextQuantity < 0) {
    throw new Error('Stock insuficiente para completar la salida.')
  }

  const updated = {
    ...current,
    quantity: nextQuantity,
    status: deriveStatus(nextQuantity),
  }

  ITEMS[targetIndex] = updated
  return cloneItem(updated)
}

/**
 * Mock API shaped like a cursor-based backend.
 * Replace internals with a real fetch later.
 */
export async function listInventory(
  params: ListInventoryParams,
): Promise<ListInventoryResult> {
  await ensureInventoryReady()
  const { search = '', categoryId = 'all', cursor, limit = 5 } = params

  await sleep(250)

  const filtered = ITEMS.filter((it) => {
    const matchesSearch =
      !normalize(search) ||
      normalize(it.name).includes(normalize(search)) ||
      normalize(it.description).includes(normalize(search))

    const matchesCategory =
      !categoryId || categoryId === 'all' || it.categoryId === categoryId

    return matchesSearch && matchesCategory
  })

  const start = cursor ? Number(cursor) : 0
  const page = filtered.slice(start, start + limit)
  const nextCursor = start + limit < filtered.length ? String(start + limit) : null

  return { items: page, nextCursor }
}

export async function createProduct(
  input: CreateProductInput,
): Promise<InventoryItem> {
  await ensureInventoryReady()

  const category = CATEGORIES.find((c) => c.id === input.categoryId)
  if (!category || category.id === 'all') {
    throw new Error('Categoría inválida')
  }

  const trimmedName = input.name.trim()
  if (!trimmedName) {
    throw new Error('Nombre inválido')
  }

  const normalizedName = normalize(trimmedName)
  const duplicated = ITEMS.some((item) => normalize(item.name) === normalizedName)
  if (duplicated) {
    throw new Error('Ya existe un artículo con ese nombre')
  }

  const quantity = Math.max(0, Math.floor(Number(input.quantity)))

  const item: InventoryItem = {
    id: nextMockId++,
    name: trimmedName,
    categoryId: input.categoryId,
    categoryName: category.name,
    description: input.description.trim(),
    cuotaRecuperacion:
      input.cuotaRecuperacion === undefined || input.cuotaRecuperacion === null
        ? null
        : Math.floor(asNonNegativeNumber(input.cuotaRecuperacion, 0) * 100) / 100,
    quantity,
    status: quantity === 0 ? 'out_of_stock' : input.status,
  }

  ITEMS.unshift(item)
  return cloneItem(item)
}
