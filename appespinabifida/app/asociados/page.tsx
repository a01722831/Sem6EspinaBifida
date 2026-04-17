"use client"

import { useState } from "react";

import Filtros from "../components/Filtros";
import ListaAsociados from "../components/ListaAsociados";
import CreateAsociadoModal from "../components/CreateAsociadoModal";

interface Filters {
  id: number | null,
  nombre: string,
  fecha: string,
  estatus: string
}

export default function Asociados() {
  const [filtros, setFiltros] = useState<Filters>({
    id: 0,
    nombre: "",
    fecha: "",
    estatus: ""
  });
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-800">
        Asociados
      </h1>

      <Filtros sendFilters={setFiltros} onCreateClick={() => setCreateOpen(true)} />

      <ListaAsociados filtros={filtros} />

      <CreateAsociadoModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
