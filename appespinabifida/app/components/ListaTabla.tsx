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
  const lastRow = rows.length - 1;

  if (rows.length === 0) {
    return (
      <div className="flex-1 flex flex-col gap-2">
        <table className="w-full text-sm border-separate border-spacing-y-0">
          <thead>
            <tr className="bg-[#003c64] text-white">
              {headers.map((label, i) => (
                <th
                  key={i}
                  className={`py-3 px-4 text-center font-semibold ${
                    i === 0 ? "rounded-l-full" : ""
                  } ${i === colCount - 1 ? "rounded-r-full" : ""}`}
                >
                  {label}
                </th>
              ))}
            </tr>
            <tr>
              <td colSpan={colCount} className="py-1" />
            </tr>
          </thead>
        </table>
        <p className="text-center text-sm text-gray-500 py-8">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-2">
      <table className="w-full text-sm border-separate border-spacing-y-0">
        <thead>
          <tr className="bg-[#003c64] text-white">
            {headers.map((label, i) => (
              <th
                key={i}
                className={`py-3 px-4 text-center font-semibold ${
                  i === 0 ? "rounded-l-full" : ""
                } ${i === colCount - 1 ? "rounded-r-full" : ""}`}
              >
                {label}
              </th>
            ))}
          </tr>
          <tr>
            <td colSpan={colCount} className="py-1" />
          </tr>
        </thead>

        <tbody className="bg-white rounded-2xl overflow-hidden">
          {rows.map((row, i) => (
            <tr
              key={row.key}
              onClick={onRowClick ? () => onRowClick(i) : undefined}
              className={`${
                i % 2 === 0 ? "bg-white" : "bg-gray-50"
              } ${onRowClick ? "hover:bg-blue-50 cursor-pointer" : ""} transition-colors`}
            >
              {row.cells.map((cell, j) => {
                const isFirstRow = i === 0;
                const isLastRow = i === lastRow;
                const isFirstCol = j === 0;
                const isLastCol = j === colCount - 1;
                return (
                  <td
                    key={j}
                    className={`py-2.5 px-4 text-gray-800 text-center border-b border-gray-200 ${
                      isFirstRow && isFirstCol ? "rounded-tl-xl" : ""
                    } ${isFirstRow && isLastCol ? "rounded-tr-xl" : ""} ${
                      isLastRow && isFirstCol ? "rounded-bl-xl" : ""
                    } ${isLastRow && isLastCol ? "rounded-br-xl" : ""} ${
                      isLastRow ? "border-b-0" : ""
                    }`}
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
