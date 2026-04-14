import ListItemEstudio from "@/components/ListItemEstudio";

export default async function DetalleConsultaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  const res = await fetch(`${process.env.BASE_URL}/api/servicios/obtener/consultas/porId?id=${(await params).id}`);
  const data = await res.json();

  const resEstudios = await fetch(`${process.env.BASE_URL}/api/servicios/obtener/estudios/porConsulta?id=${(await params).id}`);
  const listaEstudios = await resEstudios.json();

  return (
    <div className="bg-[#B9E5FB] min-h-screen flex flex-col font-sans">
      {/* Topbar */}
      <div className="bg-[#003C64] px-5 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button className="flex items-center gap-1.5 text-[13px] text-white px-2.5 py-1.5 border border-white/20 rounded-lg bg-transparent hover:bg-white/10 cursor-pointer">
          ← Servicios
        </button>
        <span className="text-[15px] font-medium text-white">Detalle de consulta</span>
        <span className="ml-auto text-[13px] text-white">Folio: {data.id_consulta}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5 pb-24">

        {/* Datos generales */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Datos generales</div>
          <div className="flex items-center gap-2 mb-3.5">
            <div className="w-8 h-8 rounded-full bg-[#E1F5EE] flex items-center justify-center text-[11px] font-medium text-[#0F6E56] shrink-0">
              {data.nombre_asociado[0]}{data.apellidos_asociado[0]}
            </div>
            <div>
              <div className="text-[14px] font-medium text-gray-900">{data.apellidos_asociado}, {data.nombre_asociado}</div>
              <div className="text-[12px] text-[#546E7A]">Asociado #{data.id_asociado} · {data.status_asociado}</div>
            </div>
          </div>
          <hr className="border-t border-gray-200 my-3.5" />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Tipo de consulta</span>
              <span className="text-[14px] text-gray-900">{data.tipo_consulta}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Estatus</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#EAF3DE] text-[#3B6D11] w-fit">
                {data.estatus}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[12px] text-[#546E7A]">Médico responsable</span>
              <span className="text-[14px] text-gray-900">{data.nombre_medico}</span>
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
              <span className="text-[14px] text-gray-900">${data.aportacion} MNX</span>
            </div>
          </div>
        </div>

        {/* Diagnóstico y tratamiento */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Diagnóstico y tratamiento</div>
          <div className="mb-2.5">
            <div className="text-[12px] text-[#546E7A] mb-1.5">Diagnóstico</div>
            <div className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 min-h-[60px] leading-relaxed">
              {data.diagnostico}
            </div>
          </div>
          <div>
            <div className="text-[12px] text-[#546E7A] mb-1.5">Tratamiento indicado</div>
            <div className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 min-h-[60px] leading-relaxed">
              {data.tratamiento}
            </div>
          </div>
        </div>

        {/* Estudios solicitados */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Estudios solicitados desde esta consulta</div>

          {listaEstudios.map((item: any, index: any) => (
            <ListItemEstudio key={index} data={item} />
          ))}
          
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
