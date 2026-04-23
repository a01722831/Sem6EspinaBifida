'use client'

import { useEffect, useMemo, useState } from 'react'

import {
  findSimilarInventoryItemsByName,
  movementItemTypeFromCategoryId,
  searchInventoryItemsByName,
} from '../../lib/api/inventory'
import { createMovement } from '../../lib/api/movements'
import type { InventoryItem } from '../../lib/types/inventory'
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

function normalizeName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
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
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [itemName, setItemName] = useState('')
  const [date, setDate] = useState('')
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [allowSimilarCreate, setAllowSimilarCreate] = useState(false)

  const [suggestions, setSuggestions] = useState<InventoryItem[]>([])
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const [similarMatches, setSimilarMatches] = useState<InventoryItem[]>([])

  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const itemTypeOptions = useMemo(() => itemTypes, [itemTypes])

  useEffect(() => {
    if (!open) return
    setErrors({})
    setSubmitError(null)
    setSubmitting(false)
    setAllowSimilarCreate(false)
    setSimilarMatches([])
    setSuggestions([])

    if (initial) {
      setMovementType(initial.movementType)
      setItemType(initial.itemType)
      setSelectedItemId(initial.itemId)
      setItemName(initial.itemName)
      setDate(initial.date)
      setQuantity(String(initial.quantity))
      setNotes(initial.notes ?? '')
      return
    }

    setMovementType('in')
    setItemType('')
    setSelectedItemId(null)
    setItemName('')
    setDate(todayISO())
    setQuantity('')
    setNotes('')
  }, [open, initial])

  useEffect(() => {
    if (!open) return

    const query = itemName.trim()
    if (!query) {
      setSuggestions([])
      setSimilarMatches([])
      return
    }

    let alive = true
    setSuggestionsLoading(true)

    Promise.all([
      searchInventoryItemsByName(query, 6),
      movementType === 'in' && selectedItemId === null && query.length >= 3
        ? findSimilarInventoryItemsByName(query, 4)
        : Promise.resolve([]),
    ])
      .then(([suggestedItems, similarItems]) => {
        if (!alive) return

        setSuggestions(suggestedItems)

        const normalizedQuery = normalizeName(query)
        const filteredSimilar = similarItems.filter(
          (item) => normalizeName(item.name) !== normalizedQuery,
        )
        setSimilarMatches(filteredSimilar)
      })
      .catch(() => {
        if (!alive) return
        setSuggestions([])
        setSimilarMatches([])
      })
      .finally(() => {
        if (!alive) return
        setSuggestionsLoading(false)
      })

    return () => {
      alive = false
    }
  }, [open, itemName, movementType, selectedItemId])

  useEffect(() => {
    if (!open) return
    setAllowSimilarCreate(false)
  }, [movementType, open])

  function validate(): boolean {
    const next: FieldErrors = {}

    if (!movementType) next.movementType = 'Selecciona el tipo de movimiento.'

    if (!date) next.date = 'Selecciona una fecha.'

    const q = Number(quantity)
    if (quantity === '' || Number.isNaN(q) || q <= 0) {
      next.quantity = 'Indica una cantidad válida (mayor a 0).'
    }

    const trimmedName = itemName.trim()
    if (movementType === 'out') {
      if (!selectedItemId) {
        next.itemName = 'Para salida debes seleccionar un artículo existente.'
      }
    } else {
      if (!trimmedName) {
        next.itemName = 'Indica el nombre del artículo.'
      }
      if (!selectedItemId && !itemType) {
        next.itemType = 'Selecciona el tipo de artículo para crear uno nuevo.'
      }
      if (!selectedItemId && similarMatches.length > 0 && !allowSimilarCreate) {
        next.itemName =
          'Hay artículos con nombre muy parecido. Selecciona una sugerencia o confirma crear uno nuevo.'
      }
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSelectSuggestion(item: InventoryItem) {
    setSelectedItemId(item.id)
    setItemName(item.name)
    setItemType(movementItemTypeFromCategoryId(item.categoryId))
    setAllowSimilarCreate(false)
    setSimilarMatches([])
    setErrors((prev) => ({
      ...prev,
      itemName: undefined,
      itemType: undefined,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return

    const resolvedType: MovementItemType =
      (itemType as MovementItemType) || 'Consumible'

    setSubmitting(true)
    try {
      const input: CreateMovementInput = {
        movementType,
        itemType: resolvedType,
        itemId: selectedItemId ?? undefined,
        itemName: itemName.trim(),
        date,
        quantity: Math.floor(Number(quantity)),
        notes: notes.trim(),
        allowSimilarCreate,
      }
      const m = await createMovement(input)
      onCreated(m)
      onClose()
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError('No se pudo registrar el movimiento. Intenta de nuevo.')
      }
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
              onChange={(e) => {
                setMovementType(e.target.value as MovementType)
                setErrors((prev) => ({ ...prev, movementType: undefined }))
              }}
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
              onChange={(e) => {
                setItemType(e.target.value as MovementItemType | '')
                setErrors((prev) => ({ ...prev, itemType: undefined }))
              }}
              aria-invalid={Boolean(errors.itemType)}
              disabled={selectedItemId !== null}
            >
              <option value="">Seleccionar…</option>
              {itemTypeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            {selectedItemId !== null ? (
              <p className="mt-1 text-xs text-slate-500">
                Se asignó automáticamente según el artículo seleccionado.
              </p>
            ) : null}
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
              onChange={(e) => {
                setItemName(e.target.value)
                setSubmitError(null)
                setAllowSimilarCreate(false)
                setErrors((prev) => ({ ...prev, itemName: undefined }))
                if (selectedItemId !== null) {
                  setSelectedItemId(null)
                }
              }}
              placeholder="Escribe para buscar y seleccionar"
              aria-invalid={Boolean(errors.itemName)}
            />

            {suggestionsLoading ? (
              <p className="mt-2 text-xs text-slate-500">Buscando artículos…</p>
            ) : null}

            {itemName.trim() ? (
              <div className="mt-2 overflow-hidden rounded-lg border border-slate-200">
                {suggestions.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto bg-white">
                    {suggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 text-left text-sm transition last:border-b-0 hover:bg-slate-50"
                        onClick={() => handleSelectSuggestion(item)}
                      >
                        <span className="font-medium text-slate-800">{item.name}</span>
                        <span className="text-xs text-slate-500">{item.categoryName}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-2 text-xs text-slate-500">
                    {movementType === 'out'
                      ? 'No hay coincidencias. Para salida debes elegir un artículo existente.'
                      : 'Sin coincidencias exactas. Puedes crear uno nuevo si lo confirmas.'}
                  </div>
                )}
              </div>
            ) : null}

            {selectedItemId !== null ? (
              <p className="mt-2 text-xs font-medium text-emerald-700">
                Artículo seleccionado del inventario.
              </p>
            ) : null}

            {movementType === 'in' && selectedItemId === null && similarMatches.length > 0 ? (
              <label className="mt-2 flex items-start gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={allowSimilarCreate}
                  onChange={(e) => setAllowSimilarCreate(e.target.checked)}
                />
                <span>
                  Hay artículos similares ({similarMatches
                    .map((item) => item.name)
                    .join(', ')}). Confirmo crear un artículo nuevo con este nombre.
                </span>
              </label>
            ) : null}

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
              onChange={(e) => {
                setQuantity(e.target.value)
                setErrors((prev) => ({ ...prev, quantity: undefined }))
              }}
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
              onChange={(e) => {
                setDate(e.target.value)
                setErrors((prev) => ({ ...prev, date: undefined }))
              }}
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
