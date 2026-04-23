'use client'

import { Pencil } from 'lucide-react'

import type { InventoryMovement } from '../../lib/types/movements'
import { Button } from '../ui/Button'

function formatMovementLine(m: InventoryMovement) {
  const label = m.movementType === 'in' ? 'Entrada' : 'Salida'
  return `${label}: ${m.quantity} unidades`
}

export function MovementHistoryList({
  items,
  loading,
  error,
  onEdit,
}: {
  items: InventoryMovement[]
  loading: boolean
  error: string | null
  onEdit?: (movement: InventoryMovement) => void
}) {
  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500" role="status">
        Cargando…
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-sm text-rose-700" role="alert">
        {error}
      </div>
    )
  }

  if (items.length === 0) {
    return <div className="p-6 text-sm text-slate-500">Sin resultados.</div>
  }

  return (
    <div className="space-y-4 p-5">
      {items.map((m) => (
        <div
          key={m.id}
          className="group flex items-center gap-4 rounded-2xl bg-white/70 px-5 py-4 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white"
        >
          <div className="flex h-12 w-16 items-center justify-center rounded-xl bg-slate-600 text-base font-semibold text-white">
            {m.id}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-base font-semibold text-slate-800">
              {m.itemName}
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
              <span className="font-medium text-slate-600">{m.itemType}</span>
              <span aria-hidden>•</span>
              <span>{m.date}</span>
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {formatMovementLine(m)}
            </div>
          </div>

          {onEdit ? (
            <Button
              type="button"
              variant="ghost"
              className="h-10 w-10 rounded-xl p-0 opacity-90 group-hover:opacity-100"
              aria-label="Editar movimiento"
              onClick={() => onEdit(m)}
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  )
}

