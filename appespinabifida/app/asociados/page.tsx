import Link from "next/link";
import ListaAsociados from "@/app/components/ListaAsociados";

export default function AsociadosPage() {
  return (
    <div className="bg-[#B9E5FB] min-h-screen flex flex-col font-sans">
      {/* Topbar */}
      <div className="bg-[#003C64] px-5 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-[13px] text-white px-2.5 py-1.5 border border-white/20 rounded-lg bg-transparent hover:bg-white/10 cursor-pointer"
        >
          ← Atrás
        </Link>
        <span className="text-[15px] font-medium text-white">Asociados</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 p-5 pb-24">
        <ListaAsociados />
      </div>
    </div>
  );
}
