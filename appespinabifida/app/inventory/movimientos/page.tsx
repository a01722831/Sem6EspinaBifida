'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Search } from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { MovementHistoryList } from '../../components/inventory/MovementHistoryList'
import { NewMovementModal } from '../../components/inventory/NewMovementModal'
import { listMovementItemTypes, listMovements } from '../../lib/api/movements'
import type {
  InventoryMovement,
  MovementItemType,
  MovementType,
} from '../../lib/types/movements'

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export default function InventoryMovementsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 350)

  const [movementType, setMovementType] = useState<MovementType | 'all'>('all')
  const [itemType, setItemType] = useState<MovementItemType | 'all'>('all')
  const [date, setDate] = useState('')

  const [itemTypes, setItemTypes] = useState<MovementItemType[]>([])

  const [items, setItems] = useState<InventoryMovement[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newMovementOpen, setNewMovementOpen] = useState(false)
  const [editingMovement, setEditingMovement] = useState<InventoryMovement | null>(
    null,
  )

  const queryKey = useMemo(
    () => `${movementType}__${itemType}__${date}__${debouncedSearch}`,
    [movementType, itemType, date, debouncedSearch],
  )

  useEffect(() => {
    let alive = true
    listMovementItemTypes()
      .then((types) => {
        if (!alive) return
        setItemTypes(types)
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
    listMovements({
      search: debouncedSearch,
      movementType,
      itemType,
      date,
      cursor: null,
      limit: 6,
    })
      .then((res) => {
        if (!alive) return
        setItems(res.items)
        setNextCursor(res.nextCursor)
      })
      .catch(() => {
        if (!alive) return
        setError('No se pudo cargar el historial de movimientos.')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [queryKey, movementType, itemType, date, debouncedSearch])

  async function onLoadMore() {
    if (!nextCursor) return
    setLoadingMore(true)
    try {
      const res = await listMovements({
        search: debouncedSearch,
        movementType,
        itemType,
        date,
        cursor: nextCursor,
        limit: 6,
      })
      setItems((prev) => [...prev, ...res.items])
      setNextCursor(res.nextCursor)
    } catch {
      setError('No se pudo cargar más datos.')
    } finally {
      setLoadingMore(false)
    }
  }

  function resetFilters() {
    setSearch('')
    setMovementType('all')
    setItemType('all')
    setDate('')
    setError(null)
  }

  function handleCreated(m: InventoryMovement) {
    setItems((prev) => [m, ...prev])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
          Movimientos de Inventario
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.push('/inventory')}
          >
            Volver a Inventario
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-slate-800 p-4 shadow-md ring-1 ring-slate-900/10">
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar"
                  aria-label="Buscar movimientos"
                  className="border-white/10 bg-white/10 pl-9 text-white placeholder:text-slate-300 focus-visible:ring-slate-200/40"
                />
              </div>

              <Button
                variant="secondary"
                className="w-full justify-center bg-slate-500 hover:bg-slate-400 active:bg-slate-600"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => {
                  setEditingMovement(null)
                  setNewMovementOpen(true)
                }}
              >
                Agregar
              </Button>

              <div className="space-y-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Tipo
                  </label>
                  <div className="relative">
                    <Select
                      value={movementType}
                      onChange={(e) =>
                        setMovementType(e.target.value as MovementType | 'all')
                      }
                      aria-label="Filtrar por tipo"
                      className="border-white/10 bg-white/10 text-white focus-visible:ring-slate-200/40"
                    >
                      <option value="all">Todos</option>
                      <option value="in">Entrada</option>
                      <option value="out">Salida</option>
                    </Select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                      ▼
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Artículo
                  </label>
                  <div className="relative">
                    <Select
                      value={itemType}
                      onChange={(e) =>
                        setItemType(e.target.value as MovementItemType | 'all')
                      }
                      aria-label="Filtrar por tipo de artículo"
                      className="border-white/10 bg-white/10 text-white focus-visible:ring-slate-200/40"
                    >
                      <option value="all">Todos</option>
                      {itemTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </Select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                      ▼
                    </span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-200">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    aria-label="Filtrar por fecha"
                    className="border-white/10 bg-white/10 text-white placeholder:text-slate-300 focus-visible:ring-slate-200/40"
                  />
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full justify-center bg-slate-600 hover:bg-slate-500 active:bg-slate-700"
                onClick={resetFilters}
              >
                Reset filtros
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70">
            <div className="rounded-t-2xl bg-slate-600 px-5 py-4 text-white">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-lg font-semibold">Historial de Movimientos</h2>
                <p className="text-sm text-white/80">
                  {items.length}
                  {items.length === 1 ? ' movimiento' : ' movimientos'}
                </p>
              </div>
            </div>
            <MovementHistoryList
              items={items}
              loading={loading}
              error={error}
              onEdit={(m) => {
                setEditingMovement(m)
                setNewMovementOpen(true)
              }}
            />
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
        </div>
      </div>

      <NewMovementModal
        open={newMovementOpen}
        onClose={() => setNewMovementOpen(false)}
        itemTypes={itemTypes}
        onCreated={handleCreated}
        initial={editingMovement}
      />
    </div>
  )
}

