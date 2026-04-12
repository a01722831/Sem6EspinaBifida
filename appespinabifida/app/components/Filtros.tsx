"use client";

export default function Filtros() {
  return (
    <aside className="bg-[#003c64] rounded-2xl p-5 flex flex-col gap-4 w-64 shrink-0">
      <button className="bg-[#F3AD1A] hover:bg-[#F3AD1A]/60 text-black text-sm font-medium py-2 px-4 rounded-md transition-colors">
        Buscar
      </button>

      <button className="bg-navy-800 hover:bg-navy-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors">
        Agregar asociado
      </button>

      <div className="flex flex-col gap-3 mt-2">
        <input
          type="text"
          placeholder="ID"
          className="rounded-md border border-white/30 bg-white/90 text-gray-800 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-steel-400"
        />
        <input
          type="text"
          placeholder="Nombre"
          className="rounded-md border border-white/30 bg-white/90 text-gray-800 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-steel-400"
        />
        <input
          type="date"
          placeholder="Fecha de alta"
          className="rounded-md border border-white/30 bg-white/90 text-gray-800 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-steel-400"
        />
        <select className="rounded-md border border-white/30 bg-white/90 text-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-steel-400">
          <option value="">Estatus</option>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>
    </aside>
  );
}
