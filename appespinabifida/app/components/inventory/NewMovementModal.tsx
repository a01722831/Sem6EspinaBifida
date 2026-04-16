'use client'

import { useEffect, useMemo, useState } from 'react'

import { createMovement } from '../../lib/api/movements'
import type {
  CreateMovementInput,
  InventoryMovement,
  MovementItemType,
  MovementType,
} from '../../lib/types/movements'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

const TITLE_ID = 'new-movement-modal-title'

type FieldErrors = {
  movementType?: string
  itemType?: string
  itemName?: string
  date?: string
  quantity?: string
}

type Props = {
  open: boolean
  onClose: () => void
  itemTypes: MovementItemType[]
  onCreated: (m: InventoryMovement) => void
  initial?: InventoryMovement | null
}

function todayISO() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function NewMovementModal({
  open,
  onClose,
  itemTypes,
  onCreated,
  initial,
}: Props) {
  const [movementType, setMovementType] = useState<MovementType>('in')
  const [itemType, setItemType] = useState<MovementItemType | ''>('')
  const [itemName, setItemName] = useState('')
  const [date, setDate] = useState('')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const itemTypeOptions = useMemo(() => itemTypes, [itemTypes])

  useEffect(() => {
    if (!open) return
    setErrors({})
    setSubmitError(null)
    setSubmitting(false)

    if (initial) {
      setMovementType(initial.movementType)
      setItemType(initial.itemType)
      setItemName(initial.itemName)
      setDate(initial.date)
      setQuantity(String(initial.quantity))
      setNotes(initial.notes ?? '')
      return
    }

    setMovementType('in')
    setItemType('')
    setItemName('')
    setDate(todayISO())
    setQuantity('')
    setNotes('')
  }, [open, initial])

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!movementType) next.movementType = 'Selecciona el tipo de movimiento.'
    if (!itemType) next.itemType = 'Selecciona el tipo de artículo.'
    if (!itemName.trim()) next.itemName = 'Indica el nombre del artículo.'
    if (!date) next.date = 'Selecciona una fecha.'

    const q = Number(quantity)
    if (quantity === '' || Number.isNaN(q) || q <= 0) {
      next.quantity = 'Indica una cantidad válida (mayor a 0).'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      const input: CreateMovementInput = {
        movementType,
        itemType: itemType as MovementItemType,
        itemName: itemName.trim(),
        date,
        quantity: Math.floor(Number(quantity)),
        notes: notes.trim(),
      }
      const m = await createMovement(input)
      onCreated(m)
      onClose()
    } catch {
      setSubmitError('No se pudo registrar el movimiento. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      titleId={TITLE_ID}
      title={initial ? 'Editar movimiento' : 'Registrar movimiento'}
      onClose={onClose}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="px-5 pb-5 pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tipo de Movimiento
            </label>
            <Select
              value={movementType}
              onChange={(e) => setMovementType(e.target.value as MovementType)}
              aria-invalid={Boolean(errors.movementType)}
            >
              <option value="in">Entrada</option>
              <option value="out">Salida</option>
            </Select>
            {errors.movementType ? (
              <p className="mt-1 text-sm text-rose-700">{errors.movementType}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Tipo de Artículo
            </label>
            <Select
              value={itemType}
              onChange={(e) => setItemType(e.target.value as MovementItemType | '')}
              aria-invalid={Boolean(errors.itemType)}
            >
              <option value="">Seleccionar…</option>
              {itemTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            {errors.itemType ? (
              <p className="mt-1 text-sm text-rose-700">{errors.itemType}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Artículo
            </label>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Nombre del artículo médico"
              aria-invalid={Boolean(errors.itemName)}
            />
            {errors.itemName ? (
              <p className="mt-1 text-sm text-rose-700">{errors.itemName}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Cantidad
            </label>
            <Input
              type="number"
              min={1}
              step={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              aria-invalid={Boolean(errors.quantity)}
            />
            {errors.quantity ? (
              <p className="mt-1 text-sm text-rose-700">{errors.quantity}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Fecha
            </label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-invalid={Boolean(errors.date)}
            />
            {errors.date ? (
              <p className="mt-1 text-sm text-rose-700">{errors.date}</p>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descripción
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalles del movimiento"
              rows={5}
            />
          </div>

          {submitError ? (
            <div className="sm:col-span-2">
              <p className="text-sm text-rose-700" role="alert">
                {submitError}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" disabled={submitting}>
            {submitting
              ? 'Registrando…'
              : initial
                ? 'Guardar cambios'
                : 'Registrar Movimiento'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

