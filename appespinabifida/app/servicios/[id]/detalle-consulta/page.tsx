export default async function DetalleConsultaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return (
    <div className="bg-[#B9E5FB] min-h-screen flex flex-col font-sans">
      {/* Topbar */}
      <div className="bg-[#003C64] px-5 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button className="flex items-center gap-1.5 text-[13px] text-white px-2.5 py-1.5 border border-white/20 rounded-lg bg-transparent hover:bg-white/10 cursor-pointer">
          ← Servicios
        </button>
        <span className="text-[15px] font-medium text-white">Detalle de consulta</span>
        <span className="ml-auto text-[13px] text-white">Folio: CONS-2026-0312</span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5 pb-24">

        {/* Datos generales */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Datos generales</div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center text-[11px] font-medium text-[#0F6E56] shrink-0">
              MR
            </div>
            <div>
              <div className="text-[14px] font-medium text-gray-900">Martínez Reyes, Juan Carlos</div>
              <div className="text-[12px] text-[#546E7A]">Asociado #0041 · Activo</div>
            </div>
          </div>
          <hr className="border-t border-gray-200 my-3.5" />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Tipo de consulta</span>
              <span className="text-[14px] text-gray-900">Consulta general</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Estatus</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#EAF3DE] text-[#3B6D11] w-fit">
                Terminada
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Médico responsable</span>
              <span className="text-[14px] text-gray-900">Dra. Sánchez Vega</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Fecha</span>
              <span className="text-[14px] text-gray-900">07 abr 2026</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Hora</span>
              <span className="text-[14px] text-gray-900">10:30 AM</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Monto de aportación</span>
              <span className="text-[14px] text-gray-900">$150.00 MXN</span>
            </div>
          </div>
        </div>

        {/* Diagnóstico y tratamiento */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Diagnóstico y tratamiento</div>
          <div className="mb-2.5">
            <div className="text-[12px] text-[#546E7A] mb-1.5">Diagnóstico</div>
            <div className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 min-h-[60px] leading-relaxed">
              Mielomeningocele nivel L3-L4. Sin cambios respecto a última consulta. Continuar con seguimiento mensual.
            </div>
          </div>
          <div>
            <div className="text-[12px] text-[#546E7A] mb-1.5">Tratamiento indicado</div>
            <div className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 min-h-[60px] leading-relaxed">
              Continuar con rehabilitación física 3 veces por semana. Revisión de ortesis en próxima visita.
            </div>
          </div>
        </div>

        {/* Estudios solicitados */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Estudios solicitados desde esta consulta</div>

          <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
            <div>
              <div className="text-[13px] font-medium text-gray-900">Resonancia magnética de columna</div>
              <div className="text-[12px] text-[#546E7A] mt-0.5">EST-2026-0088 · Solicitado el 07 abr 2026</div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#FAEEDA] text-[#854F0B]">
              Pendiente
            </span>
          </div>

          <div className="flex items-center justify-between py-2.5">
            <div>
              <div className="text-[13px] font-medium text-gray-900">Urocultivo</div>
              <div className="text-[12px] text-[#546E7A] mt-0.5">EST-2026-0089 · Solicitado el 07 abr 2026</div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#E6F1FB] text-[#185FA5]">
              Con resultados
            </span>
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
          Editar consulta
        </button>
        <button className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/20 bg-transparent text-white cursor-pointer hover:bg-white/10">
          Editar diagnóstico
        </button>
        <button className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/20 bg-transparent text-white cursor-pointer hover:bg-white/10">
          Solicitar estudio
        </button>
        <button className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/20 bg-transparent text-white cursor-pointer hover:bg-white/10">
          Cambiar estatus
        </button>
      </div>
    </div>
  );
}
