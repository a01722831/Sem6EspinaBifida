import Link from "next/link";

export default function Estudio(data: any){
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-gray-200">
            <div>
                <Link href={`/servicios/${data.data.id_estudio}/detalle-estudio`}>
                    <div className="text-[13px] font-medium text-gray-900">{data.data.nombre}</div>
                </Link>
                <div className="text-[12px] text-[#546E7A] mt-0.5">{data.data.id_estudio} · Solicitado el {data.data.fecha}</div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#FAEEDA] text-[#854F0B]">
                {data.data.estatus}
            </span>
        </div>
    )
}