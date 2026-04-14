import Filtros from "../components/Filtros";
import ImprimirOrdenButton from "../components/ImprimirOrdenButton";
import ListaAsociados from "../components/ListaAsociados";


export default function Asociados() {
  return (
    <main className="flex-1 min-h-full bg-[#b9e5fb] text-black p-6 pt-50 flex flex-col gap-4">
      <div className="flex items-center justify-end gap-1">
        <ImprimirOrdenButton />
      </div>

      <div className="flex gap-6 items-stretch">
        <Filtros />
        <ListaAsociados />
      </div>
    </main>
  );
}
