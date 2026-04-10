import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, SquareArrowOutUpRight } from 'lucide-react'

import { listCategories, listInventory } from '../api/inventory'
import type { Category, InventoryItem } from '../types/inventory'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { InventoryTable } from '../components/inventory/InventoryTable'
import { NewProductModal } from '../components/inventory/NewProductModal'

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export function InventoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState<string>('all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 400)

  const [items, setItems] = useState<InventoryItem[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newProductOpen, setNewProductOpen] = useState(false)

  const queryKey = useMemo(
    () => `${categoryId}__${debouncedSearch}`,
    [categoryId, debouncedSearch],
  )

  useEffect(() => {
    let alive = true
    listCategories()
      .then((cats) => {
        if (!alive) return
        setCategories(cats)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    listInventory({ categoryId, search: debouncedSearch, cursor: null, limit: 5 })
      .then((res) => {
        if (!alive) return
        setItems(res.items)
        setNextCursor(res.nextCursor)
      })
      .catch(() => {
        if (!alive) return
        setError('No se pudo cargar el inventario.')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [queryKey, categoryId, debouncedSearch])

  async function onProductCreated(_created: InventoryItem) {
    setSearch('')
    setCategoryId('all')
    setError(null)
    setLoading(true)
    try {
      const res = await listInventory({
        categoryId: 'all',
        search: '',
        cursor: null,
        limit: 5,
      })
      setItems(res.items)
      setNextCursor(res.nextCursor)
    } catch {
      setError('No se pudo actualizar el inventario.')
    } finally {
      setLoading(false)
    }
  }

  async function onLoadMore() {
    if (!nextCursor) return
    setLoadingMore(true)
    try {
      const res = await listInventory({
        categoryId,
        search: debouncedSearch,
        cursor: nextCursor,
        limit: 5,
      })
      setItems((prev) => [...prev, ...res.items])
      setNextCursor(res.nextCursor)
    } catch {
      setError('No se pudo cargar más datos.')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
          Inventario
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setNewProductOpen(true)}
          >
            Nuevo Producto
          </Button>
          <Button
            variant="secondary"
            leftIcon={<SquareArrowOutUpRight className="h-4 w-4" />}
            onClick={() => {}}
          >
            Movimiento Inventario
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200/70">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              className="pl-9"
            />
          </div>
          <div className="relative">
            <Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              aria-label="Filtrar por categoría"
            >
              {categories.length
                ? categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                : [
                    <option key="all" value="all">
                      Todas las categorías
                    </option>,
                  ]}
            </Select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              ▼
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70">
        <InventoryTable items={items} loading={loading} error={error} />
        <div className="flex justify-center p-5">
          <Button
            variant="secondary"
            onClick={onLoadMore}
            disabled={!nextCursor || loading || loadingMore}
          >
            {loadingMore ? 'Cargando…' : 'Cargar más datos'}
          </Button>
        </div>
      </div>

      <NewProductModal
        open={newProductOpen}
        onClose={() => setNewProductOpen(false)}
        categories={categories}
        onCreated={onProductCreated}
      />
    </div>
  )
}

