"use client";

import { AsociadoDetalle } from "@/components/ModalAsociado";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const LABORATORIOS_MOCK = [
  { id: "L01", nombre: "Lab. Médico Cerrus" },
  { id: "L02", nombre: "Centro de Imagen UDEM" },
  { id: "L03", nombre: "Hospital San José TEC" },
  { id: "L04", nombre: "Laboratorio Clínico Lomas" },
  { id: "L05", nombre: "Diagnóstica del Norte" },
];

function normalizar(s: string) {
  return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

type consulta = {
  folio: string
  tipo: string
  fecha: string
}

type tipoEstudio = {
  id_tipo_estudio: number,
  nombre: string,
  descripcion: string,
  tiempo_preparacion: string
}

export default function NuevoEstudioPage() {

  const router = useRouter();

  // Asociado search
  const [query, setQuery] = useState("");
  const [seleccionado, setSeleccionado] = useState<any | null>(null);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);

  // Datos del estudio
  const [estudio, setEstudio] = useState("");
  const [laboratorioId, setLaboratorioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [estatus, setEstatus] = useState("Pendiente");

  // Aportación
  const [montoRaw, setMontoRaw] = useState("");
  const [montoDisplay, setMontoDisplay] = useState("");
  const [yaAporto, setYaAporto] = useState(false);

  // Consulta vinculada
  const [folioConsulta, setFolioConsulta] = useState("");
  const [folioQuery, setFolioQuery] = useState("");
  const [folioDropdownAbierto, setFolioDropdownAbierto] = useState(false);

  const [ASOCIADOS, setASOCIADOS] = useState<[]>([])
  const [CONSULTAS, setCONSULTAS] = useState<consulta[]>([])
  const [TIPOESTUDIO, setTIPOESTUDIO] = useState<tipoEstudio[]>([])

  useEffect(()=>{
    const data = async () => {
      const res = await fetch("/api/asociados/lista_asociados/estudio");
      if (res.ok){
        const response = await res.json();
        if (response.status == "ok"){
          setASOCIADOS(response.data);
        }
        else{
          alert("Error al conectarse a la base de datos");
          setASOCIADOS([]);
        }
      }
      else{
        alert("Error al intentar cargar a los asociados, intentelo de nuevo mas adelante");
        setASOCIADOS([]);
      }
    }
    data();
  },[]);

  useEffect(()=>{
    const data = async () =>{
      const res = await fetch("/api/servicios/obtener/consultas/mini");
      if (res.ok){
        const data = await res.json();
        if (data.status == "ok"){
          setCONSULTAS(data.data);
        }
        else{
          alert("Error al conectar con la base de datos");
          setCONSULTAS([]);
        }
        
      }
      else{
        alert("No se pudo obtener las consultas, intente nuevamente mas tarde");
        setCONSULTAS([]);
      }
    }
    data();
  },[])

  useEffect(()=>{
    const data = async () =>{
      const res = await fetch("/api/servicios/obtener/estudios/tipos");
      if (res.ok){
        const data = await res.json();
        if (data.status == "ok"){
          setTIPOESTUDIO(data.data);
        }
        else{
          alert("Error al conectar con la base de datos");
          setTIPOESTUDIO([]);
        }
        
      }
      else{
        alert("No se pudo obtener los tipos de estudio, intente nuevamente mas tarde");
        setTIPOESTUDIO([]);
      }
    }
    data();
  },[])

  const folioSugerencias = CONSULTAS.filter((c: any) => {
      return normalizar(c.folio).includes(normalizar(folioQuery))
    }
  );

  // Notas y resultados
  const [nota, setNota] = useState("");
  const [resultados, setResultados] = useState("");

  const sugerencias = ASOCIADOS.filter(
    (a:any) =>
      normalizar(a.nombre).includes(normalizar(query)) ||
      String(a.id).includes(query)
  );

  function handleSelect(asociado: any) {
    setSeleccionado(asociado);
    setQuery(`${asociado.nombre} · #${asociado.id}`);
    setDropdownAbierto(false);
  }

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setSeleccionado(null);
    setDropdownAbierto(true);
  }

  function handleMontoBlur() {
    const num = parseFloat(montoRaw.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) {
      setMontoDisplay("");
      setMontoRaw("");
    } else {
      setMontoDisplay(`$${num.toFixed(2)}`);
    }
  }

  function handleMontoFocus() {
    setMontoDisplay(montoRaw);
  }

  async function handleGuardar() {
    
    if (!seleccionado) {
      alert("Debes seleccionar un asociado");
      return;
    }

    if (!estudio) {
      alert("Debes seleccionar un tipo de estudio");
      return;
    }

    if (!laboratorioId) {
      alert("Debes seleccionar un laboratorio");
      return;
    }

    if (!fecha) {
      alert("Debes seleccionar una fecha");
      return;
    }

    if (folioConsulta == ""){
      alert("Debes seleccionar una consulta");
      return;
    }

    const estudio_data = {
      id_asociado: seleccionado.id,
      id_medico: null,
      id_tipo_estudio: Number(estudio),
      id_consulta: Number(folioConsulta.replace("CON-","")),
      laboratorio: laboratorioId,
      aportacion: montoRaw,
      ya_aporto: (yaAporto) ? 1 : 0,
      fecha_cita: fecha,
      estatus: estatus,
      resultados: resultados
    }
    const body = {
      tipo: 1,
      data: estudio_data
    }
    const res = await fetch ("/api/servicios/agregar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    })
    if (res.ok){
      if (await res.json() == "Success"){
        alert("Estudio agregado correctamente");
        router.push("/servicios")
      }
      else{
        alert("No se pudo agregar el estudio, intente nuevamente");
      }
    }
    else{
      alert("No se puede conectar con el servicio de agregado de estudios, intente nuevamente mas tarde")
    }
  }

  return (
    <div className="bg-[#B9E5FB] min-h-screen flex flex-col font-sans">
      {/* Topbar */}
      <div className="bg-[#003C64] px-5 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button className="flex items-center gap-1.5 text-[13px] text-white px-2.5 py-1.5 border border-white/20 rounded-lg bg-transparent hover:bg-white/10 cursor-pointer">
          ← Servicios
        </button>
        <span className="text-[15px] font-medium text-white">Nuevo Estudio</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-4 p-5 pb-24">

        {/* Asociado */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Asociado</div>
          <div className="flex flex-col gap-1 relative">
            <label className="text-[12px] text-[#546E7A]">Buscar asociado</label>
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              onFocus={() => { if (!seleccionado) setDropdownAbierto(true); }}
              onBlur={() => setTimeout(() => setDropdownAbierto(false), 150)}
              placeholder="Nombre o número de asociado..."
              className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64]"
            />
            {dropdownAbierto && query.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-20 overflow-hidden">
                {sugerencias.length > 0 ? (
                  sugerencias.map((a: any) => (
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

          {seleccionado && (
            <>
              <hr className="border-t border-gray-200 my-3.5" />
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] text-[#546E7A]">Edad</span>
                  <span className="text-[14px] text-gray-900">{seleccionado.edad} años</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] text-[#546E7A]">Género</span>
                  <span className="text-[14px] text-gray-900">{seleccionado.genero}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] text-[#546E7A]">Tel. Celular</span>
                  <span className="text-[14px] text-gray-900">
                    {seleccionado.telCel || <span className="text-gray-400 italic text-[13px]">No registrado</span>}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[12px] text-[#546E7A]">Tel. Emergencia</span>
                  <span className="text-[14px] text-gray-900">
                    {seleccionado.telEmergencia || <span className="text-gray-400 italic text-[13px]">No registrado</span>}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Datos del estudio */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Datos del estudio</div>
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#546E7A]">Folio de estudio</label>
              <input
                type="text"
                disabled
                value="EST-2026-001"
                className="bg-[#F3F4F6] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-400 cursor-not-allowed select-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#546E7A]">Estudio</label>
              <select value = {estudio} onChange={(e) => setEstudio(e.target.value)} className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64] cursor-pointer">
                <option value="">Seleccionar estudio...</option>
                {TIPOESTUDIO.map((tipo: tipoEstudio) => (
                  <option key={`TE-${tipo.id_tipo_estudio}`} value={tipo.id_tipo_estudio}>{tipo.nombre}</option>
                )
                )}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#546E7A]">Laboratorio</label>
              <select
                value={laboratorioId}
                onChange={(e) => setLaboratorioId(e.target.value)}
                className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64] cursor-pointer"
              >
                <option value="">Seleccionar laboratorio...</option>
                {LABORATORIOS_MOCK.map((lab) => (
                  <option key={lab.id} value={lab.id}>{lab.nombre}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#546E7A]">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64] cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#546E7A]">Estatus</label>
              <select
                value={estatus}
                onChange={(e) => setEstatus(e.target.value)}
                className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64] cursor-pointer"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Completado">Completado</option>
              </select>
            </div>

          </div>
        </div>

        {/* Aportación */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Aportación</div>
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#546E7A]">Monto (MXN)</label>
              <input
                type="text"
                inputMode="decimal"
                value={montoDisplay}
                onChange={(e) => { setMontoRaw(e.target.value); setMontoDisplay(e.target.value); }}
                onFocus={handleMontoFocus}
                onBlur={handleMontoBlur}
                placeholder="$0.00"
                className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] text-gray-900">Ya aportó</div>
                <div className="text-[12px] text-[#546E7A]">Marcar si el pago ya fue recibido</div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={yaAporto}
                onClick={() => setYaAporto((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                  yaAporto ? "bg-[#003C64]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    yaAporto ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>


          </div>
        </div>

        {/* Consulta vinculada */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Consulta vinculada</div>
          <div className="flex flex-col gap-1 relative">
            <label className="text-[12px] text-[#546E7A]">Buscar consulta</label>
            <input
              type="text"
              value={folioQuery}
              onChange={(e) => {
                setFolioQuery(e.target.value);
                setFolioConsulta("");
                setFolioDropdownAbierto(true);
              }}
              onFocus={() => { if (!folioConsulta) setFolioDropdownAbierto(true); }}
              onBlur={() => setTimeout(() => setFolioDropdownAbierto(false), 150)}
              placeholder="Folio de consulta (ej. CON-2026-012)"
              className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64]"
            />
            {folioDropdownAbierto && folioQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-20 overflow-hidden">
                {folioSugerencias.length > 0 ? (
                  folioSugerencias.map((c:any) => (
                    <button
                      key={c.folio}
                      onMouseDown={() => {
                        setFolioConsulta(c.folio);
                        setFolioQuery(c.folio);
                        setFolioDropdownAbierto(false);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer"
                    >
                      <div className="text-[13px] text-gray-900">{c.folio}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-3 py-2.5 text-[13px] text-gray-400 italic">Sin resultados.</div>
                )}
              </div>
            )}
            <p className="text-[11px] text-gray-400 mt-0.5">
              Opcional. Vincula este estudio a una consulta existente.
            </p>
          </div>
        </div>

        {/* Notas y resultados */}
        <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
          <div className="text-[12px] font-medium text-[#546E7A] uppercase tracking-wider mb-3.5">Notas y resultados</div>
          <div className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-[12px] text-[#546E7A]">Nota</label>
              <textarea
                value={nota}
                onChange={(e) => setNota(e.target.value)}
                rows={3}
                placeholder="Observaciones adicionales..."
                className="bg-[#E9E9E9] border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64] resize-none"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[12px] text-[#546E7A]">Resultados</label>
                {estatus !== "Completado" && (
                  <span className="text-[11px] text-gray-400">Disponible al marcar como Completado</span>
                )}
              </div>
              <textarea
                value={resultados}
                onChange={(e) => setResultados(e.target.value)}
                disabled={estatus !== "Completado"}
                rows={4}
                placeholder="Pendiente. Se llenará una vez completado el estudio."
                className={`border rounded-lg px-3 py-2.5 text-[13px] placeholder:text-gray-400 outline-none resize-none transition-colors ${
                  estatus === "Completado"
                    ? "bg-[#E9E9E9] border-gray-200 text-gray-900 focus:border-[#003C64] focus:ring-1 focus:ring-[#003C64]"
                    : "bg-[#F3F4F6] border-dashed border-gray-300 text-gray-400 cursor-not-allowed"
                }`}
              />
            </div>

          </div>
        </div>

        <p className="mt-auto pt-2 text-[12px] text-[#546E7A] text-center leading-relaxed">
          Los campos marcados son obligatorios. El folio se generará automáticamente al guardar.
        </p>

      </div>

      {/* Actions bar */}
      <div className="bg-[#003C64] px-5 py-3.5 flex flex-wrap gap-2.5 sticky bottom-0">
        <button
          className="px-4 py-2 rounded-lg text-[13px] font-medium bg-[#1565C0] text-white border border-[#1565C0] cursor-pointer hover:bg-[#0D47A1]"
          onClick={handleGuardar}
        >
          Guardar estudio
        </button>
        <button onClick={() => {router.push("/servicios")}} className="px-4 py-2 rounded-lg text-[13px] font-medium border border-white/20 bg-transparent text-white cursor-pointer hover:bg-white/10">
          Cancelar
        </button>
      </div>
    </div>
  );
}
