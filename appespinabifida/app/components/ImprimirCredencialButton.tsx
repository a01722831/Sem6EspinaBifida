"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import type { AsociadoDetalle } from "./ModalAsociado";

interface ImprimirCredencialButtonProps {
  asociado: AsociadoDetalle;
}

export default function ImprimirCredencialButton({ asociado }: ImprimirCredencialButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadName, setDownloadName] = useState("credencial.pdf");

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

    try {
      const doc = new jsPDF({ format: "a4", unit: "mm" });

      // ── Header band ──────────────────────────────────────────────────────────
      doc.setFillColor(0, 60, 100);
      doc.rect(0, 0, 210, 26, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Credencial de Asociado", 14, 16);

      // ── Association name (subtitle) ──────────────────────────────────────────
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Espina Bífida — Sistema de Administración", 14, 23);

      // ── Separator ────────────────────────────────────────────────────────────
      doc.setDrawColor(220, 220, 220);
      doc.line(14, 30, 196, 30);

      // ── Photo placeholder ────────────────────────────────────────────────────
      const photoX = 160;
      const photoY = 34;
      const photoW = 36;
      const photoH = 44;
      doc.setDrawColor(180, 180, 180);
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(photoX, photoY, photoW, photoH, 2, 2, "FD");
      doc.setTextColor(180, 180, 180);
      doc.setFontSize(7);
      doc.text("Foto", photoX + photoW / 2, photoY + photoH / 2 - 2, { align: "center" });

      // ── Member name ──────────────────────────────────────────────────────────
      doc.setTextColor(0, 60, 100);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(asociado.nombre, 14, 40);

      // ── Fields ───────────────────────────────────────────────────────────────
      doc.setFontSize(10);
      let y = 50;

      const writeField = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 60, 100);
        doc.text(label, 14, y);

        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(33, 37, 41);

        const lines = doc.splitTextToSize(value || "—", 140);
        doc.text(lines, 14, y);
        y += lines.length * 6 + 4;
      };

      writeField("ID / Folio", `${asociado.id} / ${asociado.folio}`);
      writeField("CURP", asociado.curp || "—");
      writeField("Fecha de nacimiento", asociado.fechaNacimiento || "—");
      writeField("Sexo", asociado.sexo || "—");

      // Estatus badge-like field
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 60, 100);
      doc.text("Estatus", 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(33, 37, 41);
      doc.text(asociado.estatus || "—", 14, y);
      y += 10;

      // ── Divider ───────────────────────────────────────────────────────────────
      doc.setDrawColor(220, 220, 220);
      doc.line(14, y, 196, y);
      y += 8;

      // ── Vigencia ──────────────────────────────────────────────────────────────
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 60, 100);
      doc.setFontSize(9);
      doc.text("VIGENCIA", 14, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(33, 37, 41);
      doc.setFontSize(10);

      const desde = asociado.vigenciaDesde && asociado.vigenciaDesde !== "—"
        ? asociado.vigenciaDesde
        : "No registrada";
      const hasta = asociado.vigenciaHasta && asociado.vigenciaHasta !== "—"
        ? asociado.vigenciaHasta
        : "No registrada";
      doc.text(`Desde: ${desde}     Hasta: ${hasta}`, 14, y);
      y += 10;

      // ── Footer band ───────────────────────────────────────────────────────────
      doc.setFillColor(0, 60, 100);
      doc.rect(0, 285, 210, 12, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        "Documento generado por el Sistema de Administración — Espina Bífida",
        105,
        292,
        { align: "center" }
      );

      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      setPreviewUrl(blobUrl);
      setDownloadName(`credencial-${asociado.id}.pdf`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleGeneratePdf}
        disabled={isLoading}
        className="rounded-md bg-[#003C64] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#002847] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Generando..." : "Imprimir Credencial"}
      </button>

      {hasPreview ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#003C64] px-4 py-3 text-white">
              <h3 className="text-sm font-semibold">Vista previa de la credencial</h3>
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
                title="Vista previa credencial PDF"
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
