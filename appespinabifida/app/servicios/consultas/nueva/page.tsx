"use client";

import { useState } from "react";
import { useEffect } from "react";


function validarHora(valor: string): boolean {
  if (!valor) return true;
  const match = valor.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return false;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  return h >= 1 && h <= 12 && m >= 0 && m <= 59;
}

export default function NuevaConsultaPage() {

  const [data, setData] = useState<any[]>([]);
  const [medicos, setMedicos] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/asociados/lista_asociados");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
      const res2 = await fetch("/api/medicos/lista_medicos");
      if (res.ok) {
        const json = await res2.json();
        setMedicos(json);
      }
    };
    fetchData();
  }, []);

  const listaAsociados = data.map((asociado: any) => ({
    id: String(asociado.id_asociado),
    nombre: asociado.nombre + " " + asociado.apellidos,
  }))

  const [query, setQuery] = useState("");
  const [seleccionado, setSeleccionado] = useState<{ id: string; nombre: string } | null>(null);
  const [abierto, setAbierto] = useState(false);
  const [monto, setMonto] = useState("");
  const [hora, setHora] = useState("");
  const [periodo, setPeriodo] = useState("AM");
  const [horaTocada, setHoraTocada] = useState(false);
  const [tipoConsulta, setTipoConsulta] = useState("");
  const [fecha, setFecha] = useState("");

  function to24Hour(hora: string, periodo: string) {
    let [h, m] = hora.split(":").map(Number);

    if (periodo === "PM" && h !== 12) h += 12;
    if (periodo === "AM" && h === 12) h = 0;

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  }

  const horaInvalida = horaTocada && !validarHora(hora);

  async function agregarConsulta(){
    const res = await fetch("/api/servicios/agregar",{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tipo: 0,
        data: {
        id_asociado: Number(seleccionado?.id),
        id_medico: 1,
        id_recibo: null,
        tipo_consulta: tipoConsulta,
        motivo: null,
        diagnostico: null,
        tratamiento: null,
        aportacion: monto,
        ya_aporto: 0,
        estatus: abierto,
        fecha_cita: String(fecha + " " + to24Hour(hora, periodo))
        }
      }),
    })
    console.log(res);
  }

  function handleMonto(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/[^0-9]/g, "");
    if (digits === "") { setMonto(""); return; }
    const number = parseInt(digits, 10) / 100;
    setMonto(number.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  }

  function handleHora(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw.length <= 2) {
      setHora(raw.length === 2 ? raw + ":" : raw);
    } else {
      setHora(raw.slice(0, 2) + ":" + raw.slice(2, 4));
    }
  }

  function normalizar(s: string) {
    return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const sugerencias = listaAsociados.filter(
    (a: any) =>
      normalizar(a.nombre).includes(normalizar(query)) ||
      a.id.includes(query)
  );

  function handleSelect(asociado: { id: string; nombre: string }) {
    setSeleccionado(asociado);
    setQuery(`${asociado.nombre} · #${asociado.id}`);
    setAbierto(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setSeleccionado(null);
    setAbierto(true);
  }

  return (
    <div className="bg-[#B9E5FB] min-h-screen flex flex-col font-sans">
      {/* Topbar */}
      <div className="bg-[#003C64] px-5 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button className="flex items-center gap-1.5 text-[13px] text-white px-2.5 py-1.5 border border-white/20 rounded-lg bg-transparent hover:bg-white/10 cursor-pointer">
          ← Servicios
        </button>
        <span className="text-[15px] font-medium text-white">Nueva consulta</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 p-5">

        {/* Asociado */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Asociado</div>
          <div className="flex flex-col gap-1 relative">
            <label className="text-[12px] text-[#546E7A]">Buscar asociado</label>
            <input
              type="text"
              value={query}
              onChange={handleChange}
              onFocus={() => { if (!seleccionado) setAbierto(true); }}
              onBlur={() => setTimeout(() => setAbierto(false), 150)}
              placeholder="Nombre o número de asociado..."
              className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64]"
            />
            {abierto && query.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-20 overflow-hidden">
                {sugerencias.length > 0 ? (
                  sugerencias.map((a:any) => (
                    <button
                      key={a.id}
                      onMouseDown={() => handleSelect(a)}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                    >
                      <div className="text-[13px] text-gray-900">{a.nombre}</div>
                      <div className="text-[12px] text-[#546E7A]">Asociado #{a.id}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2.5 text-[13px] text-gray-400 italic">Sin resultados.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Datos de la consulta */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Datos de la consulta</div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[12px] text-[#546E7A]">Tipo de consulta</label>
                <select className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64] cursor-pointer" onChange={(e) => {
                  setTipoConsulta(e.target.value);
                }}>
                  <option value="">Seleccionar tipo...</option>
                  <option value="general">Consulta general</option>
                  <option value="seguimiento">Consulta de seguimiento</option>
                  <option value="urgencia">Consulta de urgencia</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[12px] text-[#546E7A]">Médico responsable</label>
                <select className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64] cursor-pointer">
                  <option id="sinMedico" value="">Selecciona medico responsable</option>
                  {medicos.map((medico: any) =>(
                    <option key={"medico" + medico.nombre +String(medico.id_medico)} value={medico.id_medico}>Dr(a) {medico.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#546E7A]">Fecha</label>
                <input
                  type="date"
                  className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64] cursor-pointer"
                  onChange={(e) => {
                    setFecha(e.target.value);
                  }}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12px] text-[#546E7A]">Hora</label>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      value={hora}
                      onChange={handleHora}
                      onBlur={() => setHoraTocada(true)}
                      placeholder="12:00"
                      maxLength={5}
                      className={`bg-[#E9E9E9] border rounded-lg px-3 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:ring-1 w-full ${
                        horaInvalida
                          ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                          : "border-gray-200 focus:border-[#003C64] focus:ring-[#003C64]"
                      }`}
                    />
                    {horaInvalida && (
                      <span className="text-[11px] text-red-500">Hora inválida (ej: 8:30, 12:00)</span>
                    )}
                  </div>
                  <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-2 py-2.5 text-[13px] text-gray-900 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64] cursor-pointer"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1 col-span-2">
                <label className="text-[12px] text-[#546E7A]">Monto de aportación (MXN)</label>
                <div className="flex items-center bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 focus-within:border-[#003C64] focus-within:ring-1 focus-within:ring-[#003C64]">
                  <span className="text-[13px] text-gray-400 mr-1.5">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={monto}
                    onChange={handleMonto}
                    placeholder="0.00"
                    className="bg-transparent py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none w-full"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <p className="mt-auto pt-2 text-[12px] text-[#546E7A] text-center leading-relaxed">
          Los campos marcados son obligatorios. El folio se generará automáticamente al guardar.
        </p>

      </div>

      {/* Actions bar */}
      <div className="bg-[#003C64] px-5 py-3.5 flex flex-wrap gap-2.5 sticky bottom-0">
        <button className="px-4 py-2 rounded-lg text-[13px] font-medium bg-[#003C64] text-white border border-white/50 cursor-pointer hover:bg-[#002847]" onClick={agregarConsulta}>
          Guardar consulta
        </button>
        <button className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/20 bg-transparent text-white cursor-pointer hover:bg-white/10">
          Cancelar
        </button>
      </div>
    </div>
  );
}
