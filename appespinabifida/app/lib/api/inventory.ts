import type {
  Category,
  CreateProductInput,
  InventoryItem,
  ListInventoryParams,
  ListInventoryResult,
} from '../types/inventory'

const MOCK_CATEGORIES: Category[] = [
  { id: 'all', name: 'Todas las categorías' },
  { id: 'med', name: 'Medicamento' },
  { id: 'mat', name: 'Material Médico' },
  { id: 'eq', name: 'Equipo Médico' },
  { id: 'con', name: 'Consumible' },
]

const MOCK_ITEMS: InventoryItem[] = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    categoryId: 'med',
    categoryName: 'Medicamento',
    description: 'Analgésico y antipirético',
    quantity: 500,
    status: 'in_stock',
  },
  {
    id: 2,
    name: 'Jeringas 5ml',
    categoryId: 'mat',
    categoryName: 'Material Médico',
    description: 'Jeringas desechables estériles',
    quantity: 1000,
    status: 'in_stock',
  },
  {
    id: 3,
    name: 'Tensiómetro Digital',
    categoryId: 'eq',
    categoryName: 'Equipo Médico',
    description: 'Monitor de presión arterial',
    quantity: 15,
    status: 'in_stock',
  },
  {
    id: 4,
    name: 'Guantes de Látex',
    categoryId: 'con',
    categoryName: 'Consumible',
    description: 'Guantes estériles talla M',
    quantity: 250,
    status: 'in_stock',
  },
  {
    id: 5,
    name: 'Ibuprofeno 600mg',
    categoryId: 'med',
    categoryName: 'Medicamento',
    description: 'Antiinflamatorio',
    quantity: 300,
    status: 'in_stock',
  },
  {
    id: 6,
    name: 'Alcohol 70%',
    categoryId: 'con',
    categoryName: 'Consumible',
    description: 'Desinfectante para limpieza',
    quantity: 120,
    status: 'in_stock',
  },
  {
    id: 7,
    name: 'Sutura Nylon 3-0',
    categoryId: 'mat',
    categoryName: 'Material Médico',
    description: 'Hilo de sutura estéril',
    quantity: 40,
    status: 'in_stock',
  },
  {
    id: 8,
    name: 'Termómetro Infrarrojo',
    categoryId: 'eq',
    categoryName: 'Equipo Médico',
    description: 'Medición sin contacto',
    quantity: 6,
    status: 'in_stock',
  },
]

let nextMockId =
  MOCK_ITEMS.reduce((max, it) => Math.max(max, it.id), 0) + 1

function normalize(s: string) {
  return s.trim().toLowerCase()
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

export async function listCategories(): Promise<Category[]> {
  await sleep(150)
  return MOCK_CATEGORIES
}

/**
 * Mock API shaped like a cursor-based backend.
 * Replace internals with a real fetch later.
 */
export async function listInventory(
  params: ListInventoryParams,
): Promise<ListInventoryResult> {
  const { search = '', categoryId = 'all', cursor, limit = 5 } = params

  await sleep(250)

  const filtered = MOCK_ITEMS.filter((it) => {
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

/**
 * Mock create; replace with POST /inventory later.
 */
export async function createProduct(
  input: CreateProductInput,
): Promise<InventoryItem> {
  await sleep(200)

  const category = MOCK_CATEGORIES.find((c) => c.id === input.categoryId)
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

  MOCK_ITEMS.unshift(item)
  return item
}
