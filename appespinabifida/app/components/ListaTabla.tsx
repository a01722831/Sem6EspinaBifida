import type { ReactNode } from "react";

export type ListaTablaRow = {
  key: string;
  cells: ReactNode[];
};

export type ListaTablaProps = {
  headers: string[];
  rows: ListaTablaRow[];
  onRowClick?: (rowIndex: number) => void;
  emptyMessage?: string;
};

export default function ListaTabla({
  headers,
  rows,
  onRowClick,
  emptyMessage = "Sin datos",
}: ListaTablaProps) {
  const colCount = headers.length;

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-600 text-white">
            {headers.map((label, i) => (
              <th
                key={i}
                className={`px-4 py-4 text-left text-sm font-semibold ${
                  i === 0 ? "rounded-tl-2xl" : ""
                } ${i === colCount - 1 ? "rounded-tr-2xl" : ""}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} className="px-4 py-6 text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={row.key}
                onClick={onRowClick ? () => onRowClick(i) : undefined}
                className={`transition ${onRowClick ? "cursor-pointer hover:bg-slate-50" : ""}`}
              >
                {row.cells.map((cell, j) => (
                  <td
                    key={j}
                    className="px-4 py-4 text-sm text-slate-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
