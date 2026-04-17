"use client";
import {useState} from "react";

type FilterProps = {
  sendFilters: Function,
  onCreateClick?: () => void;
}

export default function Filtros({sendFilters, onCreateClick} : FilterProps) {

  const [id, setId] = useState<number | null>(null);
  const [nombre, setNombre] = useState<String>("");
  const [fecha, setFecha] = useState<String>("");
  const [estatus, setEstatus] = useState<String>("");

  function applyFilters(){
    const Filters = {
      id: id,
      nombre: nombre,
      fecha: fecha,
      estatus: estatus
    }
    sendFilters(Filters);
  }

  return (
    <aside className="bg-[#003c64] rounded-2xl p-5 flex flex-col gap-4 w-64 shrink-0">
      <button onClick={applyFilters} className="bg-[#F3AD1A] hover:bg-[#F3AD1A]/60 text-black text-sm font-medium py-2 px-4 rounded-md transition-colors">
        Buscar
      </button>

      <button
        type="button"
        onClick={onCreateClick}
        className="bg-navy-800 hover:bg-navy-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
      >
        Agregar asociado
      </button>

      <div className="flex flex-col gap-3 mt-2">
        <input
          onChange={(e) => setId(Number(e.target.value))}
          type="number"
          placeholder="ID"
          className="rounded-md border border-white/30 bg-white/90 text-gray-800 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-steel-400"
        />
        <input
          onChange={(e) => setNombre(e.target.value)}
          type="text"
          placeholder="Nombre"
          className="rounded-md border border-white/30 bg-white/90 text-gray-800 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-steel-400"
        />
        <input
          onChange={(e) => setFecha(e.target.value)}
          type="date"
          placeholder="Fecha de alta"
          className="rounded-md border border-white/30 bg-white/90 text-gray-800 placeholder-gray-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-steel-400"
        />
        <select onChange={(e) => setEstatus(e.target.value)} className="rounded-md border border-white/30 bg-white/90 text-gray-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-steel-400">
          <option value="">Estatus</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
          <option value="Pendiente">Pendiente</option>
        </select>
      </div>
    </aside>
  );
}
