'use client'

import { Badge } from '../ui/Badge'
import type { InventoryItem } from '../../lib/types/inventory'

export function InventoryTable({
  items,
  loading,
  error,
}: {
  items: InventoryItem[]
  loading: boolean
  error: string | null
}) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[900px] w-full border-collapse">
        <thead>
          <tr className="bg-slate-600 text-white">
            <th className="rounded-tl-2xl px-4 py-4 text-left text-sm font-semibold">
              ID
            </th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Artículo</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Categoría</th>
            <th className="px-4 py-4 text-left text-sm font-semibold">
              Descripción
            </th>
            <th className="px-4 py-4 text-left text-sm font-semibold">Cantidad</th>
            <th className="rounded-tr-2xl px-4 py-4 text-left text-sm font-semibold">
              Disponibilidad
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {loading ? (
            <tr>
              <td className="px-4 py-6 text-sm text-slate-500" colSpan={6}>
                Cargando…
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td className="px-4 py-6 text-sm text-rose-700" colSpan={6}>
                {error}
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td className="px-4 py-6 text-sm text-slate-500" colSpan={6}>
                Sin resultados.
              </td>
            </tr>
          ) : (
            items.map((it) => (
              <tr key={it.id}>
                <td className="px-4 py-5 text-sm text-slate-700">{it.id}</td>
                <td className="px-4 py-5 text-sm font-medium text-slate-800">
                  {it.name}
                </td>
                <td className="px-4 py-5 text-sm text-slate-700">
                  {it.categoryName}
                </td>
                <td className="px-4 py-5 text-sm text-slate-600">
                  {it.description}
                </td>
                <td className="px-4 py-5 text-sm text-slate-700">{it.quantity}</td>
                <td className="px-4 py-5 text-sm">
                  <Badge variant={it.status === 'in_stock' ? 'success' : 'neutral'}>
                    {it.status === 'in_stock' ? 'En stock' : 'Agotado'}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
