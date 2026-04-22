"use client";

import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import HalfLogoSrc from "../assets/HalfLogo.png";
import type { AsociadoDetalle } from "./ModalAsociado";

interface ImprimirCredencialButtonProps {
  asociado: AsociadoDetalle;
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export default function ImprimirCredencialButton({
  asociado,
}: ImprimirCredencialButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [downloadName, setDownloadName] = useState("credencial.pdf");

  const hasPreview = useMemo(() => previewUrl.length > 0, [previewUrl]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleGeneratePdf() {
    setIsLoading(true);
    setErrorMessage("");

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }

    try {
      const logoData = await loadImageAsBase64(HalfLogoSrc.src);

      // A4 landscape: 297 × 210 mm
      const doc = new jsPDF({ format: "a4", unit: "mm", orientation: "landscape" });

      // ── Layout ────────────────────────────────────────────────────────────────
      const HALF_W = 128;
      const GAP = 3;
      const CARD_H = 82;
      const LEFT_X = (297 - 2 * HALF_W - GAP) / 2; // 19
      const RIGHT_X = LEFT_X + HALF_W + GAP;         // 150
      const TOP_Y = (210 - CARD_H) / 2;              // 64
      const BOT_Y = TOP_Y + CARD_H;                  // 146
      const PAD = 3;

      // Content bounds
      const FL = LEFT_X + PAD;            // 22  (front left)
      const FR = LEFT_X + HALF_W - PAD;   // 144 (front right)
      const BL = RIGHT_X + PAD;           // 153 (back left)
      const BR = RIGHT_X + HALF_W - PAD;  // 275 (back right)

      // ── Card borders ──────────────────────────────────────────────────────────
      doc.setDrawColor(120, 120, 120);
      doc.setLineWidth(0.4);
      doc.rect(LEFT_X, TOP_Y, HALF_W, CARD_H);
      doc.rect(RIGHT_X, TOP_Y, HALF_W, CARD_H);

      // ── Shared helper: label + value sitting on a thin underline ─────────────
      // The underline runs from `x` to `endX` just below the baseline, like a
      // fill-in-the-blank form field.  The value is truncated to fit.
      const drawField = (
        label: string,
        value: string,
        x: number,
        y: number,
        endX: number,
        fontSize = 7
      ) => {
        doc.setFontSize(fontSize);
        doc.setTextColor(0, 0, 0);
        doc.setLineWidth(0.2);

        doc.setFont("helvetica", "bold");
        doc.text(label, x, y);
        const lw = doc.getTextWidth(label);

        doc.setDrawColor(80, 80, 80);
        doc.line(x, y + 1.2, endX, y + 1.2);

        doc.setFont("helvetica", "normal");
        const available = endX - x - lw - 1;
        if (available > 0) {
          const truncated = doc.splitTextToSize(value || "", available)[0] ?? "";
          doc.text(truncated, x + lw + 1, y);
        }
      };

      // ══════════════════════════════ FRONT ════════════════════════════════════

      // Logo (top-left, nearly square 648×606 → render at 26×24)
      const LOGO_W = 26;
      const LOGO_H = 24;
      const LOGO_RIGHT = FL + LOGO_W + 2; // 50
      if (logoData) {
        doc.addImage(logoData, "PNG", FL, TOP_Y + PAD, LOGO_W, LOGO_H);
      } else {
        doc.setFillColor(230, 160, 40);
        doc.rect(FL, TOP_Y + PAD, LOGO_W, LOGO_H, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(5.5);
        doc.text("ESPINA\nBÍFIDA", FL + LOGO_W / 2, TOP_Y + PAD + LOGO_H / 2 - 1, {
          align: "center",
        });
      }

      // Folio (top-right corner)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      doc.text(
        `Folio:  ${asociado.folio || "—"}`,
        FR,
        TOP_Y + PAD + 5,
        { align: "right" }
      );

      // Nombre
      drawField("Nombre:", asociado.nombre, LOGO_RIGHT, TOP_Y + PAD + 12, FR);

      // Dirección
      drawField(
        "Dirección:",
        asociado.direccion || "—",
        LOGO_RIGHT,
        TOP_Y + PAD + 21,
        FR
      );

      const PHOTO_X = FL;
      const PHOTO_Y = TOP_Y + PAD + LOGO_H + 3;
      const PHOTO_W = 25;
      const PHOTO_H = 30;

      if (foto) {
        doc.addImage(foto, "JPEG", PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H);
      } else {
        // fallback (optional)
        doc.setDrawColor(150, 150, 150);
        doc.setFillColor(235, 235, 235);
        doc.rect(PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H, "FD");
        doc.setTextColor(160, 160, 160);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(6);
        doc.text("Foto", PHOTO_X + PHOTO_W / 2, PHOTO_Y + PHOTO_H / 2, {
          align: "center",
        });
      }

      const PHOTO_RIGHT = PHOTO_X + PHOTO_W + 2; // 49

      // Tel. Casa (beside photo, upper half)
      drawField(
        "Tel. Casa:",
        asociado.telCasa || "—",
        PHOTO_RIGHT,
        PHOTO_Y + 9,
        LEFT_X + 98
      );

      // Nombre de padres (beside photo, lower half)
      drawField(
        "Nombre de padres:",
        asociado.nombrePadreMadre || "—",
        PHOTO_RIGHT,
        PHOTO_Y + 20,
        FR
      );

      // Fecha de Expedición (below photo)
      const expY = PHOTO_Y + PHOTO_H + 5; // 129
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      doc.text("Fecha de Expedición:", FL, expY);
      doc.setFont("helvetica", "normal");
      const expLW = doc.getTextWidth("Fecha de Expedición:");
      doc.text(asociado.fechaAlta || "—", FL + expLW + 2, expY);

      // ══════════════════════════════ BACK ═════════════════════════════════════

      // Padecimiento
      drawField(
        "Padecimiento:",
        asociado.padecimiento || "—",
        BL,
        TOP_Y + PAD + 8,
        BR
      );

      // Tipo de Sangre  ·  Tiene Válvula?  (same row)
      const midBackX = BL + 63; // ~216 — divides the row in two
      drawField(
        "Tipo de Sangre:",
        asociado.tipoSangre || "—",
        BL,
        TOP_Y + PAD + 18,
        midBackX - 2
      );
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(0, 0, 0);
      doc.text("Tiene Válvula?", midBackX, TOP_Y + PAD + 18);
      doc.setFont("helvetica", "normal");
      const valvStr =
        asociado.valvula === true
          ? "Sí"
          : asociado.valvula === false
          ? "No"
          : "—";
      doc.text(
        valvStr,
        midBackX + doc.getTextWidth("Tiene Válvula?") + 2,
        TOP_Y + PAD + 18
      );

      // En caso de accidente avisar a
      drawField(
        "En caso de accidente avisar a:",
        asociado.contactoEmergencia?.nombre || "—",
        BL,
        TOP_Y + PAD + 28,
        BR,
        6.5
      );

      // Teléfono (emergency contact)
      drawField(
        "Teléfono:",
        asociado.contactoEmergencia?.telefono || "—",
        BL,
        TOP_Y + PAD + 37,
        BR
      );

      // Correo Electrónico
      drawField(
        "Correo Electrónico:",
        asociado.correo || "—",
        BL,
        TOP_Y + PAD + 46,
        BR
      );

      // Separator line
      const SEP_Y = TOP_Y + PAD + 53; // 120
      doc.setDrawColor(160, 160, 160);
      doc.setLineWidth(0.3);
      doc.line(BL, SEP_Y, BR, SEP_Y);

      // Bottom-left: org identity
      const ORG_Y = SEP_Y + 3; // 123
      const ORG_LOGO_W = 13;
      const ORG_LOGO_H = 12;
      if (logoData) {
        doc.addImage(logoData, "PNG", BL, ORG_Y, ORG_LOGO_W, ORG_LOGO_H);
      }
      const orgTX = BL + ORG_LOGO_W + 2; // 168
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.5);
      doc.setTextColor(0, 0, 0);
      doc.text("ASOCIACION DE ESPINA BIFIDA", orgTX, ORG_Y + 4);
      doc.text("DE NUEVO LEON ABP", orgTX, ORG_Y + 8.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5);
      doc.text("Monterrey, N.L.", orgTX, ORG_Y + 13);
      doc.text("www.espinabifida.org.mx", orgTX, ORG_Y + 17);

      // Bottom-right: Datos de Nacimiento
      const BIRTH_X = BL + 74; // 227
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(0, 0, 0);
      doc.text("Datos de Nacimiento:", BIRTH_X, ORG_Y + 3);

      const birthRow = (label: string, value: string, y: number) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(6);
        doc.text(label, BIRTH_X, y);
        doc.setFont("helvetica", "normal");
        doc.text(value || "—", BIRTH_X + doc.getTextWidth(label) + 1.5, y);
      };

      birthRow("Fecha:", asociado.fechaNacimiento || "—", ORG_Y + 9);
      birthRow("Lugar Nac.", asociado.lugarNacimiento || "—", ORG_Y + 14.5);
      birthRow("Hospital", asociado.hospital || "—", ORG_Y + 20);

      // ── Generate blob & open preview ─────────────────────────────────────────
      const blob = doc.output("blob");
      const blobUrl = URL.createObjectURL(blob);
      setPreviewUrl(blobUrl);
      setDownloadName(`credencial-${asociado.id}.pdf`);
    } catch {
      setErrorMessage("Error al generar la credencial. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  // State for the image
  const [foto, setFoto] = useState("");

  // Function to fetch and build image source
  async function buildImageSrc() {
    const obj = await (
      await fetch(`/api/asociados/fotoAsociado/obtener?id=${asociado.id}`)
    ).json();

    if (!obj || !obj.image || !obj.mime) {
      throw new Error("Invalid image object");
    }

    setFoto(`data:${obj.mime};base64,${obj.image}`);
  }

  // Load image on mount
  useEffect(() => {
    buildImageSrc();
  }, []);

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

      {errorMessage ? (
        <p className="max-w-xs text-right text-xs text-red-600">{errorMessage}</p>
      ) : null}

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
