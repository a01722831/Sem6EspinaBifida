'use client'

import { useEffect, useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import { FileText } from 'lucide-react'
import type { InventoryItem } from '../../lib/types/inventory'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ComodatoButtonProps {
  item: InventoryItem
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ComodatoButton({ item }: ComodatoButtonProps) {
  // Form modal state
  const [formOpen, setFormOpen] = useState(false)
  const [receptor, setReceptor] = useState('')
  const [cantidad, setCantidad] = useState(String(item.quantity > 0 ? 1 : 0))
  const [fecha, setFecha] = useState(today())
  const [formError, setFormError] = useState<string | null>(null)

  // PDF preview state
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [downloadName, setDownloadName] = useState('comodato.pdf')

  const hasPreview = useMemo(() => previewUrl.length > 0, [previewUrl])

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function openForm() {
    setReceptor('')
    setCantidad(String(item.quantity > 0 ? 1 : 0))
    setFecha(today())
    setFormError(null)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setFormError(null)
  }

  function closePreview() {
    URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
  }

  // ── PDF generation ───────────────────────────────────────────────────────────

  function handleGenerate() {
    const cantidadNum = Number(cantidad)

    if (!receptor.trim()) {
      setFormError('El nombre del receptor es requerido.')
      return
    }
    if (!Number.isInteger(cantidadNum) || cantidadNum <= 0) {
      setFormError('La cantidad debe ser un número entero positivo.')
      return
    }
    if (cantidadNum > item.quantity) {
      setFormError(`La cantidad no puede superar el stock disponible (${item.quantity}).`)
      return
    }

    setFormError(null)
    setIsLoading(true)
    closeForm()

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl('')
    }

    try {
      const doc = new jsPDF({ format: 'a4', unit: 'mm' })
      const PAGE_W = 210
      const MARGIN = 14
      const CONTENT_W = PAGE_W - MARGIN * 2

      // ── Header bar ────────────────────────────────────────────────────────────
      doc.setFillColor(0, 60, 100)
      doc.rect(0, 0, PAGE_W, 28, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(17)
      doc.text('Constancia de Comodato', MARGIN, 17)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text('Asociación de Espina Bífida de Nuevo León A.B.P.', MARGIN, 24)

      // ── Folio / Fecha row ─────────────────────────────────────────────────────
      doc.setTextColor(80, 80, 80)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(`Fecha de préstamo: ${formatDate(fecha)}`, MARGIN, 36)
      doc.text(
        `Folio: COM-${item.id}-${Date.now().toString().slice(-6)}`,
        PAGE_W - MARGIN,
        36,
        { align: 'right' },
      )

      doc.setDrawColor(220, 220, 220)
      doc.setLineWidth(0.4)
      doc.line(MARGIN, 40, PAGE_W - MARGIN, 40)

      // ── Field renderer ────────────────────────────────────────────────────────
      let y = 50
      const writeField = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(0, 60, 100)
        doc.text(label, MARGIN, y)
        y += 6
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(33, 37, 41)
        const lines = doc.splitTextToSize(value || '—', CONTENT_W)
        doc.text(lines, MARGIN, y)
        y += lines.length * 6 + 5
      }

      writeField('Receptor del artículo', receptor.trim())
      writeField('Artículo', item.name)
      writeField('Categoría', item.categoryName)
      if (item.description) {
        writeField('Descripción', item.description)
      }
      writeField('Cantidad entregada', String(cantidadNum))

      // ── Separator ─────────────────────────────────────────────────────────────
      y += 4
      doc.setDrawColor(200, 200, 200)
      doc.setLineWidth(0.3)
      doc.line(MARGIN, y, PAGE_W - MARGIN, y)
      y += 10

      // ── Disclaimer ────────────────────────────────────────────────────────────
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(0, 60, 100)
      doc.text('Términos y condiciones del comodato', MARGIN, y)
      y += 7

      const disclaimer =
        'El artículo descrito en este documento es propiedad de la Asociación de Espina ' +
        'Bífida de Nuevo León A.B.P. y se entrega en calidad de comodato, es decir, para ' +
        'su uso temporal y gratuito. El receptor se compromete a conservarlo en buen estado ' +
        'y a devolverlo en las condiciones en que fue recibido. En caso de pérdida, robo o ' +
        'daño atribuible al mal uso del artículo, el receptor quedará obligado a cubrir el ' +
        'costo total o parcial de su reparación o reposición, según lo determine la ' +
        'Asociación. La devolución deberá realizarse en la fecha acordada con la Asociación.'

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(33, 37, 41)
      const disclaimerLines = doc.splitTextToSize(disclaimer, CONTENT_W)
      doc.text(disclaimerLines, MARGIN, y)
      y += disclaimerLines.length * 5.5 + 14

      // ── Signature block ───────────────────────────────────────────────────────
      const SIG_W = 70
      const SIG_LEFT = MARGIN
      const SIG_RIGHT = PAGE_W - MARGIN - SIG_W

      // Left signature — receptor
      doc.setDrawColor(80, 80, 80)
      doc.setLineWidth(0.4)
      doc.line(SIG_LEFT, y, SIG_LEFT + SIG_W, y)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(0, 0, 0)
      doc.text('Firma del receptor', SIG_LEFT + SIG_W / 2, y + 5, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(80, 80, 80)
      const receptorTrunc = doc.splitTextToSize(receptor.trim(), SIG_W)[0] ?? ''
      doc.text(receptorTrunc, SIG_LEFT + SIG_W / 2, y + 10, { align: 'center' })

      // Right signature — association representative
      doc.setDrawColor(80, 80, 80)
      doc.setLineWidth(0.4)
      doc.line(SIG_RIGHT, y, SIG_RIGHT + SIG_W, y)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(0, 0, 0)
      doc.text('Firma del representante', SIG_RIGHT + SIG_W / 2, y + 5, { align: 'center' })
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(80, 80, 80)
      doc.text('Asociación Espina Bífida N.L.', SIG_RIGHT + SIG_W / 2, y + 10, {
        align: 'center',
      })

      // ── Footer ────────────────────────────────────────────────────────────────
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(160, 160, 160)
      doc.text(
        'Asociación de Espina Bífida de Nuevo León A.B.P.  ·  Monterrey, N.L.  ·  www.espinabifida.org.mx',
        PAGE_W / 2,
        287,
        { align: 'center' },
      )

      const blob = doc.output('blob')
      const blobUrl = URL.createObjectURL(blob)
      setPreviewUrl(blobUrl)
      setDownloadName(`comodato-${item.id}-${today()}.pdf`)
    } catch {
      // silently swallow — preview just won't open
    } finally {
      setIsLoading(false)
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={openForm}
        className="inline-flex items-center gap-1.5 rounded-full bg-[#003C64] px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-[#002847] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading || item.quantity === 0}
        title={item.quantity === 0 ? 'Sin stock disponible' : 'Generar comodato'}
      >
        <FileText className="h-3.5 w-3.5" />
        Comodato
      </button>

      {/* Form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-2xl bg-[#003C64] px-5 py-4">
              <h2 className="text-sm font-semibold text-white">Generar Comodato</h2>
              <button
                type="button"
                onClick={closeForm}
                className="rounded border border-white/30 px-2.5 py-1 text-xs text-white hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 px-5 py-5">
              {/* Item info (read-only) */}
              <div className="rounded-lg bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Artículo
                </p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500">{item.categoryName}</p>
              </div>

              {/* Fecha */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Fecha de préstamo
                </label>
                <Input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>

              {/* Receptor */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Nombre del receptor <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Nombre completo de quien recibe el artículo"
                  value={receptor}
                  onChange={(e) => setReceptor(e.target.value)}
                />
              </div>

              {/* Cantidad */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Cantidad <span className="text-rose-500">*</span>
                  <span className="ml-1 font-normal text-slate-400">
                    (máx. {item.quantity})
                  </span>
                </label>
                <Input
                  type="number"
                  min={1}
                  max={item.quantity}
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                />
              </div>

              {/* Error */}
              {formError && (
                <p className="text-xs text-rose-600">{formError}</p>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
              <Button variant="secondary" onClick={closeForm}>
                Cancelar
              </Button>
              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 rounded-md bg-[#003C64] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#002847]"
              >
                <FileText className="h-4 w-4" />
                Generar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF preview modal */}
      {hasPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#003C64] px-4 py-3 text-white">
              <h3 className="text-sm font-semibold">Vista previa del comodato</h3>
              <button
                type="button"
                onClick={closePreview}
                className="rounded-md border border-white/30 px-3 py-1 text-xs hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 bg-gray-100 p-2">
              <iframe
                src={previewUrl}
                title="Vista previa comodato PDF"
                className="h-full w-full rounded-md border border-gray-200 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-200 p-3">
              <a
                href={previewUrl}
                download={downloadName}
                className="rounded-md bg-[#003C64] px-4 py-2 text-sm font-medium text-white hover:bg-[#002847]"
              >
                Descargar PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
