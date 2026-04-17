import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ImprimirOrdenButton from "../../../components/ImprimirOrdenButton";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ESTATUS_CLASSES: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-800",
  "En proceso": "bg-blue-100 text-blue-800",
  Completado: "bg-emerald-100 text-emerald-800",
  Cancelado: "bg-rose-100 text-rose-800",
};

function EstatusBadge({ estatus }: { estatus: string }) {
  const cls = ESTATUS_CLASSES[estatus] ?? "bg-slate-100 text-slate-800";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${cls}`}
    >
      {estatus}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DetalleEstudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.BASE_URL}/api/servicios/obtener/estudios/porId?id=${id}`
  );
  const data = await res.json();

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <Link
          href="/servicios"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Servicios
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
              Detalle de estudio
            </h1>
            <span className="text-sm text-slate-500">
              Folio: EST-{data.id_estudio}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <ImprimirOrdenButton
              estudioId={data.id_estudio}
              nombreAsociado={data.nombre_asociado ?? ""}
              apellidosAsociado={data.apellidos_asociado ?? ""}
              tipoEstudio={data.tipo_estudio ?? ""}
              fecha={data.fecha ?? ""}
              medicoEstudio={data.medico_estudio ?? ""}
            />
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-600 h-10">
              Editar estudio
            </button>
          </div>
        </div>
      </div>

      {/* Datos generales */}
      <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70 px-6 py-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Datos generales
        </h2>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-medium text-violet-700">
            {data.nombre_asociado?.[0]}
            {data.apellidos_asociado?.[0]}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-800">
              {data.apellidos_asociado ?? "—"}, {data.nombre_asociado ?? "—"}
            </div>
            <div className="text-xs text-slate-500">
              Asociado #{data.id_asociado} · {data.estatus_asociado}
            </div>
          </div>
        </div>
        <hr className="mb-4 border-slate-200" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <span className="mb-0.5 block text-xs text-slate-500">
              Tipo de estudio
            </span>
            <span className="text-sm text-slate-800">{data.tipo_estudio}</span>
          </div>
          <div>
            <span className="mb-0.5 block text-xs text-slate-500">Estatus</span>
            <EstatusBadge estatus={data.estatus} />
          </div>
          <div>
            <span className="mb-0.5 block text-xs text-slate-500">
              Médico responsable
            </span>
            <span className="text-sm text-slate-800">{data.medico_estudio}</span>
          </div>
          <div>
            <span className="mb-0.5 block text-xs text-slate-500">Fecha</span>
            <span className="text-sm text-slate-800">{data.fecha}</span>
          </div>
          <div>
            <span className="mb-0.5 block text-xs text-slate-500">Hora</span>
            <span className="text-sm text-slate-800">{data.hora}</span>
          </div>
          <div>
            <span className="mb-0.5 block text-xs text-slate-500">
              Monto de aportación
            </span>
            <span className="text-sm text-slate-800">
              ${data.aportacion} MXN
            </span>
          </div>
        </div>
      </div>

      {/* Consulta vinculada */}
      <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70 px-6 py-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Consulta vinculada
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-800">
              {data.tipo_consulta} · CON-{data.id_consulta}
            </div>
            <div className="text-xs text-slate-500">
              {data.fecha_consulta} · {data.medico_consulta}
            </div>
          </div>
          <Link
            href={`/servicios/${data.id_consulta}/detalle-consulta`}
            className="text-sm font-medium text-sky-600 hover:text-sky-800 transition"
          >
            Ver consulta ↗
          </Link>
        </div>
      </div>

      {/* Resultados del estudio */}
      <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70 px-6 py-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Resultados del estudio
        </h2>
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-400">
            Aún no se han registrado resultados para este estudio.
          </p>
          <button className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-slate-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-slate-600 h-9">
            + Registrar resultados
          </button>
        </div>
      </div>

      {/* Recibo vinculado */}
      <div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70 px-6 py-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Recibo vinculado
        </h2>
        <div className="flex items-center justify-between">
          <span className="text-sm italic text-slate-400">
            Sin recibo vinculado aún.
          </span>
          <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-700 px-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-600 h-9">
            Vincular recibo
          </button>
        </div>
      </div>

    </div>
  );
}
