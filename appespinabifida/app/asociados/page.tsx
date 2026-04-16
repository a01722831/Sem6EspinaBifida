"use client";

import { useState } from "react";

import Filtros from "../components/Filtros";
import ImprimirOrdenButton from "../components/ImprimirOrdenButton";
import ListaAsociados, {
  initialAsociadosData,
} from "../components/ListaAsociados";
import CreateAsociadoModal from "../components/CreateAsociadoModal";
import type { AsociadoDetalle } from "../components/ModalAsociado";


export default function Asociados() {
  const [asociados, setAsociados] = useState<AsociadoDetalle[]>(
    initialAsociadosData,
  );
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <main className="space-y-6 text-slate-900">
      <div className="flex items-center justify-end">
        <ImprimirOrdenButton />
      </div>

      <div className="flex flex-col items-stretch gap-6 lg:flex-row">
        <Filtros onCreateClick={() => setCreateOpen(true)} />
        <ListaAsociados
          items={asociados}
          onUpdateAsociado={(index, next) => {
            setAsociados((prev) =>
              prev.map((item, itemIndex) => (itemIndex === index ? next : item)),
            );
          }}
        />
      </div>
      <CreateAsociadoModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(newAsociado) => {
          setAsociados((prev) => [newAsociado, ...prev]);
        }}
      />
    </main>
  );
}
