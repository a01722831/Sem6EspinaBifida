'use client'

import { useEffect, useState } from 'react'

import { createProduct } from '@/lib/api/inventory'
import type { Category, InventoryItem, InventoryStatus } from '@/lib/types/inventory'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

const TITLE_ID = 'new-product-modal-title'

type FieldErrors = {
  name?: string
  categoryId?: string
  quantity?: string
}

type Props = {
  open: boolean
  onClose: () => void
  categories: Category[]
  onCreated: (item: InventoryItem) => void
}

export function NewProductModal({ open, onClose, categories, onCreated }: Props) {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [status, setStatus] = useState<InventoryStatus>('in_stock')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const categoryOptions = categories.filter((c) => c.id !== 'all')

  useEffect(() => {
    if (!open) return
    setName('')
    setCategoryId('')
    setDescription('')
    setQuantity('')
    setStatus('in_stock')
    setErrors({})
    setSubmitError(null)
    setSubmitting(false)
  }, [open])

  function validate(): boolean {
    const next: FieldErrors = {}
    const trimmedName = name.trim()
    if (!trimmedName) next.name = 'Indica el nombre del artículo.'
    if (!categoryId) next.categoryId = 'Selecciona una categoría.'
    const q = Number(quantity)
    if (quantity === '' || Number.isNaN(q) || q < 0) {
      next.quantity = 'Indica una cantidad válida (0 o mayor).'
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
      const item = await createProduct({
        name: name.trim(),
        categoryId,
        description: description.trim(),
        quantity: Math.floor(Number(quantity)),
        status,
      })
      onCreated(item)
      onClose()
    } catch {
      setSubmitError('No se pudo guardar el producto. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      titleId={TITLE_ID}
      title="Nuevo producto"
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="px-5 pb-5 pt-4">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="np-name"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Artículo
            </label>
            <Input
              id="np-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del producto"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? 'np-name-err' : undefined}
            />
            {errors.name ? (
              <p id="np-name-err" className="mt-1 text-sm text-rose-700">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="np-category"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Categoría
            </label>
            <Select
              id="np-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              aria-invalid={Boolean(errors.categoryId)}
              aria-describedby={errors.categoryId ? 'np-cat-err' : undefined}
            >
              <option value="">Selecciona categoría</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
            {errors.categoryId ? (
              <p id="np-cat-err" className="mt-1 text-sm text-rose-700">
                {errors.categoryId}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="np-desc"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Descripción
            </label>
            <Textarea
              id="np-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripción breve"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="np-qty"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Cantidad inicial
              </label>
              <Input
                id="np-qty"
                type="number"
                min={0}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                aria-invalid={Boolean(errors.quantity)}
                aria-describedby={errors.quantity ? 'np-qty-err' : undefined}
              />
              {errors.quantity ? (
                <p id="np-qty-err" className="mt-1 text-sm text-rose-700">
                  {errors.quantity}
                </p>
              ) : null}
            </div>
            <div>
              <label
                htmlFor="np-status"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Disponibilidad
              </label>
              <Select
                id="np-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as InventoryStatus)
                }
              >
                <option value="in_stock">En stock</option>
                <option value="out_of_stock">Agotado</option>
              </Select>
            </div>
          </div>

          {submitError ? (
            <p className="text-sm text-rose-700" role="alert">
              {submitError}
            </p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" disabled={submitting}>
            {submitting ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
