type Estatus = "Activo" | "Inactivo" | "Pendiente";

interface Asociado {
  id: string;
  nombre: string;
  estatus: Estatus;
  fechaAlta: string;
}

const badgeColors: Record<Estatus, string> = {
  Activo: "bg-green-600/10 text-green-600",
  Inactivo: "bg-red-500/10 text-red-500",
  Pendiente: "bg-yellow-600/10 text-yellow-600",
};

const mockData: Asociado[] = [
  { id: "A-1002", nombre: "María García Hernández", estatus: "Inactivo", fechaAlta: "20/03/2023" },
  { id: "A-1003", nombre: "Carlos Rodríguez López", estatus: "Activo", fechaAlta: "10/05/2023" },
  { id: "A-1004", nombre: "Laura Sánchez Pérez", estatus: "Activo", fechaAlta: "10/05/2023" },
  { id: "A-1005", nombre: "Pedro Gómez Ruiz", estatus: "Inactivo", fechaAlta: "20/03/2023" },
  { id: "A-1006", nombre: "Carmen López Torres", estatus: "Inactivo", fechaAlta: "24/03/2023" },
  { id: "A-1007", nombre: "Fancio López Garradi", estatus: "Activo", fechaAlta: "19/05/2023" },
  { id: "A-1008", nombre: "María García Pérez", estatus: "Activo", fechaAlta: "20/03/2023" },
  { id: "A-1009", nombre: "Pedro Gómez Ruiz", estatus: "Activo", fechaAlta: "10/03/2023" },
  { id: "A-1010", nombre: "Laura Verez Pérez", estatus: "Activo", fechaAlta: "15/03/2023" },
  { id: "A-1011", nombre: "Carly Rodríguez López", estatus: "Inactivo", fechaAlta: "20/03/2023" },
  { id: "A-1013", nombre: "María Marías Hernández", estatus: "Pendiente", fechaAlta: "20/03/2023" },
  { id: "A-1014", nombre: "Pedro Gómez Ruiz", estatus: "Activo", fechaAlta: "10/05/2023" },
];

export default function Tabla() {
  return (
    <div className="flex-1 flex flex-col gap-2">
      <table className="w-full text-sm border-separate border-spacing-y-0">

        <thead>
          <tr className="bg-[#003c64] text-white">
            <th className="py-3 px-4 text-center font-semibold rounded-l-full">ID</th>
            <th className="py-3 px-4 text-center font-semibold">Nombre</th>
            <th className="py-3 px-4 text-center font-semibold">Estatus</th>
            <th className="py-3 px-4 text-center font-semibold rounded-r-full">Fecha de alta</th>
          </tr>
          <tr><td colSpan={4} className="py-1" /></tr>
        </thead>

        <tbody className="bg-white rounded-2xl overflow-hidden">
          {mockData.map((row, i) => (
            <tr
              key={row.id}
              className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors`}
            >
              <td className={`py-2.5 px-4 text-gray-800 text-center border-b border-gray-200 ${i === 0 ? "rounded-tl-xl" : ""} ${i === mockData.length - 1 ? "rounded-bl-xl border-b-0" : ""}`}>{row.id}</td>
              <td className={`py-2.5 px-4 text-gray-800 text-center border-b border-gray-200 ${i === mockData.length - 1 ? "border-b-0" : ""}`}>{row.nombre}</td>
              <td className={`py-2.5 px-4 text-center border-b border-gray-200 ${i === mockData.length - 1 ? "border-b-0" : ""}`}>
                <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${badgeColors[row.estatus]}`}>
                  {row.estatus}
                </span>
              </td>
              <td className={`py-2.5 px-4 text-gray-800 text-center border-b border-gray-200 ${i === 0 ? "rounded-tr-xl" : ""} ${i === mockData.length - 1 ? "rounded-br-xl border-b-0" : ""}`}>{row.fechaAlta}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
