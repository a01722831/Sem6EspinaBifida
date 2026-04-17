import type {
  Category,
  CreateProductInput,
  InventoryItem,
  ListInventoryParams,
  ListInventoryResult,
} from '../types/inventory'

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todas las categorías' },
  { id: 'medicamento', name: 'Medicamento' },
  { id: 'material medico', name: 'Material Médico' },
  { id: 'equipo medico', name: 'Equipo Médico' },
  { id: 'consumible', name: 'Consumible' },
]

let ITEMS: InventoryItem[] = [];

let nextMockId =
  ITEMS.reduce((max, it) => Math.max(max, it.id), 0) + 1

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function listCategories(): Promise<Category[]> {
  return CATEGORIES
}

/**
 * Mock API shaped like a cursor-based backend.
 * Replace internals with a real fetch later.
 */
export async function listInventory(
  params: ListInventoryParams,
): Promise<ListInventoryResult> {
  const { search = '', categoryId = 'all', cursor, limit = 5 } = params
  const res = await fetch(`/api/inventario/obtener/inventario`);
  if (res.ok){
    ITEMS = await res.json();
    console.log(ITEMS);
  }
  
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

  const category = CATEGORIES.find((c) => c.id === input.categoryId)
  if (!category || category.id === 'all') {
    throw new Error('Categoría inválida')
  }

  const item: InventoryItem = {
    id: nextMockId++,
    name: input.name.trim(),
    categoryId: input.categoryId,
    categoryName: category.name,
    description: input.description.trim(),
    quantity: Math.max(0, Math.floor(Number(input.quantity))),
    status: input.status,
  }

  ITEMS.unshift(item)
  return item
}
