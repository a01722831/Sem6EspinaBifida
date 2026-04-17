"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";

type ImprimirOrdenButtonProps = {
  estudioId: string | number;
  nombreAsociado: string;
  apellidosAsociado: string;
  tipoEstudio: string;
  fecha: string;
  medicoEstudio: string;
};

export default function ImprimirOrdenButton({
  estudioId,
  nombreAsociado,
  apellidosAsociado,
  tipoEstudio,
  fecha,
  medicoEstudio,
}: ImprimirOrdenButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
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

  function handleGeneratePdf() {
    setIsLoading(true);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    const cleanId = String(estudioId);
    const nombreCompleto =
      nombreAsociado && apellidosAsociado
        ? `${apellidosAsociado.trim()}, ${nombreAsociado.trim()}`
        : nombreAsociado || apellidosAsociado || "No disponible";

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

    writeField("Nombre del asociado", nombreCompleto);
    writeField("Tipo de estudio", tipoEstudio || "No disponible");
    writeField("Fecha de la cita", fecha || "No disponible");
    writeField("Médico responsable", medicoEstudio || "No disponible");

    const blob = doc.output("blob");
    const blobUrl = URL.createObjectURL(blob);
    setPreviewUrl(blobUrl);
    setDownloadName(`orden-estudio-${cleanId}.pdf`);
    setIsLoading(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleGeneratePdf}
        disabled={isLoading}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-600 h-10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Generando..." : "Imprimir orden"}
      </button>

      {hasPreview && (
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
      )}
    </>
  );
}
