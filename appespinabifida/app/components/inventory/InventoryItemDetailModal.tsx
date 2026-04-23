'use client'

import { useEffect, useState } from 'react'

import { listMovements } from '../../lib/api/movements'
import { updateInventoryItemQuota } from '../../lib/api/inventory'
import type { InventoryItem } from '../../lib/types/inventory'
import type { InventoryMovement } from '../../lib/types/movements'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { MovementHistoryList } from './MovementHistoryList'

type TabName = 'info' | 'movements'

type Props = {
  open: boolean
  item: InventoryItem | null
  onClose: () => void
  onItemUpdated: (item: InventoryItem) => void
}

const TITLE_ID = 'inventory-item-detail-modal-title'

function statusLabel(status: InventoryItem['status']) {
  if (status === 'in_stock') return 'En stock'
  if (status === 'low_stock') return 'Limitado'
  return 'Agotado'
}

function statusVariant(status: InventoryItem['status']) {
  if (status === 'in_stock') return 'success'
  if (status === 'low_stock') return 'warning'
  return 'failed'
}

export function InventoryItemDetailModal({
  open,
  item,
  onClose,
  onItemUpdated,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabName>('info')
  const [cuotaValue, setCuotaValue] = useState('')
  const [cuotaError, setCuotaError] = useState<string | null>(null)
  const [savingQuota, setSavingQuota] = useState(false)
  const [quotaSaved, setQuotaSaved] = useState(false)

  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [movementsLoading, setMovementsLoading] = useState(false)
  const [movementsError, setMovementsError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !item) return

    setActiveTab('info')
    setCuotaError(null)
    setQuotaSaved(false)
    setCuotaValue(
      item.cuotaRecuperacion === null ? '' : String(item.cuotaRecuperacion),
    )
  }, [open, item])

  useEffect(() => {
    if (!open || !item || activeTab !== 'movements') return

    let alive = true
    setMovementsLoading(true)
    setMovementsError(null)

    listMovements({
      movementType: 'all',
      itemType: 'all',
      itemId: item.id,
      itemName: item.name,
      date: '',
      search: '',
      cursor: null,
      limit: 50,
    })
      .then((res) => {
        if (!alive) return
        setMovements(res.items)
      })
      .catch(() => {
        if (!alive) return
        setMovementsError('No se pudieron cargar los movimientos de este artículo.')
      })
      .finally(() => {
        if (!alive) return
        setMovementsLoading(false)
      })

    return () => {
      alive = false
    }
  }, [open, item, activeTab])

  if (!item) return null
  const currentItem = item

  async function handleSaveQuota() {
    setQuotaSaved(false)
    setCuotaError(null)

    const trimmed = cuotaValue.trim()
    if (!trimmed) {
      setSavingQuota(true)
      try {
        const updated = await updateInventoryItemQuota(currentItem.id, null)
        onItemUpdated(updated)
        setQuotaSaved(true)
      } catch {
        setCuotaError('No se pudo actualizar la cuota de recuperación.')
      } finally {
        setSavingQuota(false)
      }
      return
    }

    const parsed = Number(trimmed)
    if (Number.isNaN(parsed) || parsed < 0) {
      setCuotaError('Ingresa una cuota válida mayor o igual a 0.')
      return
    }

    setSavingQuota(true)
    try {
      const updated = await updateInventoryItemQuota(currentItem.id, parsed)
      onItemUpdated(updated)
      setQuotaSaved(true)
    } catch {
      setCuotaError('No se pudo actualizar la cuota de recuperación.')
    } finally {
      setSavingQuota(false)
    }
  }

  return (
    <Modal
      open={open}
      titleId={TITLE_ID}
      title={`Artículo: ${currentItem.name}`}
      onClose={onClose}
      className="max-w-4xl"
    >
      <div className="px-5 pb-5 pt-4">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-100 pb-3">
          <Button
            type="button"
            variant={activeTab === 'info' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('info')}
          >
            Información del artículo
          </Button>
          <Button
            type="button"
            variant={activeTab === 'movements' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('movements')}
          >
            Movimientos asociados
          </Button>
        </div>

        {activeTab === 'info' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                <p className="text-xs text-slate-500">ID</p>
                <p className="text-sm font-semibold text-slate-800">{currentItem.id}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                <p className="text-xs text-slate-500">Categoría</p>
                <p className="text-sm font-semibold text-slate-800">{currentItem.categoryName}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                <p className="text-xs text-slate-500">Inventario actual</p>
                <p className="text-sm font-semibold text-slate-800">{currentItem.quantity} unidades</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
                <p className="text-xs text-slate-500">Disponibilidad</p>
                <Badge variant={statusVariant(currentItem.status)} className="mt-1">
                  {statusLabel(currentItem.status)}
                </Badge>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200/70">
              <p className="mb-2 text-xs text-slate-500">Descripción completa</p>
              <p className="whitespace-pre-wrap text-sm text-slate-700">
                {currentItem.description || 'Sin descripción'}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Cuota de recuperación
              </label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={cuotaValue}
                onChange={(e) => {
                  setQuotaSaved(false)
                  setCuotaValue(e.target.value)
                }}
                placeholder="Ej. 150.00"
                aria-invalid={Boolean(cuotaError)}
              />
              {cuotaError ? (
                <p className="mt-1 text-sm text-rose-700">{cuotaError}</p>
              ) : null}
              {quotaSaved ? (
                <p className="mt-1 text-sm text-emerald-700">Cuota actualizada.</p>
              ) : (
                <p className="mt-1 text-xs text-slate-500">
                  Puedes dejarlo vacío para mantenerla sin definir.
                </p>
              )}
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleSaveQuota}
                  disabled={savingQuota}
                >
                  {savingQuota ? 'Guardando…' : 'Guardar cuota'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white ring-1 ring-slate-200/70">
            <MovementHistoryList
              items={movements}
              loading={movementsLoading}
              error={movementsError}
            />
          </div>
        )}
      </div>
    </Modal>
  )
}
