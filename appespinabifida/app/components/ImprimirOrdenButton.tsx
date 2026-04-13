"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type EstudioApiItem = {
  nombre_asociado?: string;
  apellidos_asociado?: string;
  tipo_estudio?: string;
  fecha?: string;
  medico_estudio?: string;
  nombre_medico?: string;
};

function normalizeNombreAsociado(item: EstudioApiItem): string {
  const nombre = item.nombre_asociado?.trim() ?? "";
  const apellidos = item.apellidos_asociado?.trim() ?? "";

  if (nombre && apellidos) {
    return `${apellidos}, ${nombre}`;
  }

  return nombre || apellidos || "No disponible";
}

export default function ImprimirOrdenButton() {
  const [estudioId, setEstudioId] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadName, setDownloadName] = useState("orden-estudio.pdf");

  const hasPreview = useMemo(() => previewUrl.length > 0, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function handleGeneratePdf() {
    const cleanId = estudioId.trim();

    if (!cleanId) {
      setErrorMessage("Ingresa un id de estudio para continuar.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    try {
      const response = await fetch(
        `/api/servicios/obtener/estudio-por-id?id=${encodeURIComponent(cleanId)}`
      );
      const payload = await response.json();

      if (!response.ok) {
        setErrorMessage(payload?.error ?? "No se pudo obtener el estudio.");
        return;
      }

      const item = payload?.item as EstudioApiItem | undefined;

      if (!item) {
        setErrorMessage("No hay informacion disponible para este estudio.");
        return;
      }

      const nombreAsociado = normalizeNombreAsociado(item);
      const tipoEstudio = item.tipo_estudio?.trim() || "No disponible";
      const fechaCita = item.fecha?.trim() || "No disponible";
      const medicoResponsable =
        item.medico_estudio?.trim() ||
        item.nombre_medico?.trim() ||
        "No disponible";

      const doc = new jsPDF({ format: "a4", unit: "mm" });

      doc.setFillColor(0, 60, 100);
      doc.rect(0, 0, 210, 26, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Orden de Estudio", 14, 16);

      doc.setTextColor(42, 42, 42);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`ID de estudio: ${cleanId}`, 14, 34);

      doc.setDrawColor(220, 220, 220);
      doc.line(14, 38, 196, 38);

      let y = 48;
      const writeField = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 60, 100);
        doc.text(label, 14, y);

        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(33, 37, 41);

        const lines = doc.splitTextToSize(value, 182);
        doc.text(lines, 14, y);
        y += lines.length * 6 + 4;
      };

      writeField("Nombre del asociado", nombreAsociado);
      writeField("Tipo de estudio", tipoEstudio);
      writeField("Fecha de la cita", fechaCita);
      writeField("Medico responsable", medicoResponsable);

      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      setPreviewUrl(blobUrl);
      setDownloadName(`orden-estudio-${cleanId}.pdf`);
    } catch {
      setErrorMessage("Error al generar el PDF. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <input
          type="text"
          value={estudioId}
          onChange={(event) => setEstudioId(event.target.value)}
          placeholder="ID estudio"
          className="w-28 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64]"
        />
        <button
          type="button"
          onClick={handleGeneratePdf}
          disabled={isLoading}
          className="rounded-md bg-[#003C64] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#002847] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Generando..." : "Imprimir Orden"}
        </button>
      </div>

      {errorMessage ? (
        <p className="max-w-xs text-right text-xs text-red-600">{errorMessage}</p>
      ) : null}

      {hasPreview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#003C64] px-4 py-3 text-white">
              <h3 className="text-sm font-semibold">Vista previa de la orden</h3>
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(previewUrl);
                  setPreviewUrl("");
                }}
                className="rounded-md border border-white/30 px-3 py-1 text-xs hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 bg-gray-100 p-2">
              <iframe
                src={previewUrl}
                title="Vista previa PDF"
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
      ) : null}
    </div>
  );
}
