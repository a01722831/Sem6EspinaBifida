import Link from "next/link";

export default async function DetalleEstudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/obtenerEstudioPorId?id=${(await params).id}`);
  const data = (await res.json()).items[0];

  return (
    <div className="bg-[#B9E5FB] min-h-screen flex flex-col font-sans">
      {/* Topbar */}
      <div className="bg-[#003C64] px-5 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button className="flex items-center gap-1.5 text-[13px] text-white px-2.5 py-1.5 border border-white/20 rounded-lg bg-transparent hover:bg-white/10 cursor-pointer">
          ← Servicios
        </button>
        <span className="text-[15px] font-medium text-white">Detalle de estudio</span>
        <span className="ml-auto text-[13px] text-white">Folio: {data.id_estudio}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5 pb-24">

        {/* Datos generales */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Datos generales</div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-8 h-8 rounded-full bg-[#EEEDFE] flex items-center justify-center text-[11px] font-medium text-[#534AB7] shrink-0">
              MR
            </div>
            <div>
              <div className="text-[14px] font-medium text-gray-900">Martínez Reyes, Juan Carlos</div>
              <div className="text-[12px] text-[#546E7A]">Asociado #{data.id_asociado} · {data.estatus_asociado}</div>
            </div>
          </div>
          <hr className="border-t border-gray-200 my-3.5" />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Tipo de estudio</span>
              <span className="text-[14px] text-gray-900">{data.tipo_estudio}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Estatus</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#FAEEDA] text-[#854F0B] w-fit">
                {data.estatus}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Médico responsable</span>
              <span className="text-[14px] text-gray-900">{data.medico_estudio}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Fecha</span>
              <span className="text-[14px] text-gray-900">{data.fecha}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Hora</span>
              <span className="text-[14px] text-gray-900">{data.hora}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Monto de aportación</span>
              <span className="text-[14px] text-gray-900">${data.aportacion} MXN</span>
            </div>
          </div>
        </div>

        {/* Consulta vinculada */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Consulta vinculada</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[14px] font-medium text-gray-900">Tipo de consulta: {data.tipo_consulta} · {data.id_consulta}</div>
              <div className="text-[12px] text-[#546E7A]">{data.fecha_consulta} · {data.medico_consulta}</div>
            </div>
            <Link href={`/servicios/${data.id_consulta}/detalle-consulta`}>
              <span className="text-[13px] text-[#185FA5] cursor-pointer underline">Ver consulta ↗</span>
            </Link>
          </div>
        </div>

        {/* Resultados del estudio */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="flex items-center justify-between mb-3.5">
            <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider">Resultados del estudio</div>
            <button className="flex items-center gap-1.5 text-[12px] text-[#546E7A] px-2.5 py-1.5 border border-gray-200 rounded-lg bg-transparent hover:bg-gray-50 cursor-pointer">
              Imprimir orden
            </button>
          </div>
          <div className="bg-[#E9E9E9] border border-dashed border-gray-300 rounded-lg p-5 text-center">
            <div className="text-[13px] text-gray-400">Aún no se han registrado resultados para este estudio.</div>
            <button className="mt-3 px-3.5 py-1.5 rounded-lg text-[12px] font-medium bg-[#003C64] text-white border border-[#003C64] cursor-pointer hover:bg-[#002847]">
              + Registrar resultados
            </button>
          </div>
        </div>

        {/* Recibo vinculado */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Recibo vinculado</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] text-gray-400 italic">Sin recibo vinculado aún.</div>
            </div>
            <button className="px-3 py-1.5 rounded-lg text-[12px] font-medium border border-gray-300 bg-transparent text-gray-900 cursor-pointer hover:bg-gray-50">
              Vincular recibo
            </button>
          </div>
        </div>

      </div>

      {/* Actions bar */}
      <div className="bg-[#003C64] px-5 py-3.5 flex flex-wrap gap-2.5 sticky bottom-0">
        <button className="px-4 py-2 rounded-lg text-[13px] font-medium bg-[#003C64] text-white border border-white/50 cursor-pointer hover:bg-[#002847]">
          Editar estudio
        </button>
        <button className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/20 bg-transparent text-white cursor-pointer hover:bg-white/10">
          Registrar resultados
        </button>
        <button className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/20 bg-transparent text-white cursor-pointer hover:bg-white/10">
          Vincular consulta
        </button>
        <button className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/20 bg-transparent text-white cursor-pointer hover:bg-white/10">
          Cambiar estatus
        </button>
      </div>
    </div>
  );
}
