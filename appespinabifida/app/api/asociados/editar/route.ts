type Estatus = "Activo" | "Inactivo" | "Pendiente";
type Sexo = "Masculino" | "Femenino";

type FormState = {
  id: string;
  fechaAlta: string;
  nombre: string;
  apellidos: string;
  curp: string;
  fechaNacimiento: string;
  edad: string;
  sexo: Sexo;
  estatus: Estatus;
  nombrePadreMadre: string;
  etapaVida: string;
  vive: "si" | "no";
  fechaUltRecibo: string;
  ciudad: string;
  estado: string;
  cp: string;
  telCasa: string;
  telTrabajo: string;
  telCel: string;
  correo: string;
  contactoNombre: string;
  contactoTelefono: string;
  contactoRelacion: string;
  vigenciaDesde: string;
  vigenciaHasta: string;
  fotoUrl: string;
  lugarNacimiento: string;
  hospital: string;
  padecimiento: string;
  tipoSangre: string;
  valvula: "si" | "no";
  controlUrologico: "si" | "no";
  lugarControlUrologico: string;
  fechaGralOrina: string;
  fechaEcoRenal: string;
  fechaEstUrodinamico: string;
  fechaTacCerebro: string;
  fechaUrocultivo: string;
  fechaUroTac: string;
  fechaUltEstUro: string;
  fechaOtrosEstudios: string;
  madreLugarNacimiento: string;
  madreEscolaridad: string;
  madreEdad: string;
  madreOcupacion: string;
  madreParentescoConPareja: "si" | "no";
  madreCdInicioEmbarazo: string;
  madreAcidoFolicoAntesDuranteEmbarazo: "si" | "no";
  madreCantidadCitasControlPrenatal: string;
  madreSeguro: string;
  padreLugarNacimiento: string;
  padreEscolaridad: string;
  padreEdad: string;
  padreOcupacion: string;
  padreParentescoConPareja: "si" | "no";
  padreSeguro: string;
  adiccionesAmbos: string;
  otroHijoConDTN: "si" | "no";
  familiarConDTN: "si" | "no";
  exposicionToxicosEmbarazo: "si" | "no";
  descripcionToxinas: string;
};

export interface ContactoEmergencia {
  nombre: string;
  telefono: string;
  relacion: string;
}

export interface AsociadoDetalle {
  id: string;
  folio: string;
  nombre: string;
  fechaNacimiento: string;
  sexo: Sexo;
  curp: string;
  direccion: string;
  telefonos: string[];
  contactoEmergencia: ContactoEmergencia;
  fechaAlta: string;
  estatus: Estatus;
  fechaUltRecibo?: string;
  etapaVida?: string;
  vive?: boolean;
  vigenciaDesde?: string;
  vigenciaHasta?: string;
  lugarNacimiento?: string;
  hospital?: string;
  edad?: string;
  nombrePadreMadre?: string;
  ciudad?: string;
  estado?: string;
  cp?: string;
  telCasa?: string;
  telTrabajo?: string;
  telCel?: string;
  correo?: string;
  /** Pestaña Historial — clínico */
  padecimiento?: string;
  tipoSangre?: string;
  valvula?: boolean;
  controlUrologico?: boolean;
  lugarControlUrologico?: string;
  fechaGralOrina?: string;
  fechaEcoRenal?: string;
  fechaEstUrodinamico?: string;
  fechaTacCerebro?: string;
  fechaUrocultivo?: string;
  fechaUroTac?: string;
  fechaUltEstUro?: string;
  fechaOtrosEstudios?: string;
  madreLugarNacimiento?: string;
  madreEscolaridad?: string;
  madreEdad?: string;
  madreOcupacion?: string;
  madreParentescoConPareja?: boolean;
  madreCdInicioEmbarazo?: string;
  madreAcidoFolicoAntesDuranteEmbarazo?: boolean;
  madreCantidadCitasControlPrenatal?: string;
  madreSeguro?: string;
  padreLugarNacimiento?: string;
  padreEscolaridad?: string;
  padreEdad?: string;
  padreOcupacion?: string;
  padreParentescoConPareja?: boolean;
  padreSeguro?: string;
  adiccionesAmbos?: string;
  otroHijoConDTN?: boolean;
  familiarConDTN?: boolean;
  exposicionToxicosEmbarazo?: boolean;
  descripcionToxinas?: string;
  fotoUrl?: string;
}

function splitName(fullName: string) {
  if (!fullName || typeof fullName !== "string") {
    return { firstName: "", lastName: "" };
  }

  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) {
    return {
      firstName: parts[0],
      lastName: ""
    };
  }

  if (parts.length === 2) {
    return {
      firstName: parts[0],
      lastName: parts[1]
    };
  }

  // 3+ words → first 2 are first name, rest is last name
  return {
    firstName: parts.slice(0, 2).join(" "),
    lastName: parts.slice(2).join(" ")
  };
}

function splitDirections(str: string) {
  if (!str) return [];
  return str.split(",").map(s => s.trim()).filter(Boolean);
}

function mapDetalleToForm(a: AsociadoDetalle): FormState {
  const [t0, t1, t2] = a.telefonos ?? [];
  const names = splitName(a.nombre);
  const direccion = splitDirections(a.direccion);
  return {
    id: a.id ?? "",
    fechaAlta: a.fechaAlta ?? "",
    nombre: names.firstName ?? "",
    apellidos: names.lastName ??  "",
    curp: a.curp ?? "",
    fechaNacimiento: a.fechaNacimiento ?? "",
    edad: a.edad ?? "",
    sexo: a.sexo ?? "Femenino",
    estatus: a.estatus ?? "Activo",

    nombrePadreMadre: a.nombrePadreMadre ?? "",
    etapaVida: a.etapaVida ?? "",

    vive: a.vive === true ? "si" : "no",

    fechaUltRecibo: a.fechaUltRecibo ?? "",

    direccion: direccion[0] ?? "",
    ciudad: direccion[1] ?? "",
    estado: direccion[2] ?? "",
    cp: direccion[3] ?? "",

    telCasa: a.telCasa ?? t0 ?? "",
    telTrabajo: a.telTrabajo ?? t1 ?? "",
    telCel: a.telCel ?? t2 ?? t1 ?? t0 ?? "",

    correo: a.correo ?? "",

    contactoNombre: a.contactoEmergencia?.nombre ?? "",
    contactoTelefono: a.contactoEmergencia?.telefono ?? "",
    contactoRelacion: a.contactoEmergencia?.relacion ?? "",

    vigenciaDesde: a.vigenciaDesde ?? "",
    vigenciaHasta: a.vigenciaHasta ?? "",

    fotoUrl: a.fotoUrl ?? "",

    lugarNacimiento: a.lugarNacimiento ?? "",
    hospital: a.hospital ?? "",
    padecimiento: a.padecimiento ?? "",
    tipoSangre: a.tipoSangre ?? "",

    valvula: a.valvula ? "si" : "no",
    controlUrologico: a.controlUrologico ? "si" : "no",

    lugarControlUrologico: a.lugarControlUrologico ?? "",

    fechaGralOrina: a.fechaGralOrina ?? "",
    fechaEcoRenal: a.fechaEcoRenal ?? "",
    fechaEstUrodinamico: a.fechaEstUrodinamico ?? "",
    fechaTacCerebro: a.fechaTacCerebro ?? "",
    fechaUrocultivo: a.fechaUrocultivo ?? "",
    fechaUroTac: a.fechaUroTac ?? "",
    fechaUltEstUro: a.fechaUltEstUro ?? "",
    fechaOtrosEstudios: a.fechaOtrosEstudios ?? "",

    madreLugarNacimiento: a.madreLugarNacimiento ?? "",
    madreEscolaridad: a.madreEscolaridad ?? "",
    madreEdad: a.madreEdad?.toString?.() ?? "",
    madreOcupacion: a.madreOcupacion ?? "",
    madreParentescoConPareja: a.madreParentescoConPareja ? "si" : "no",
    madreCdInicioEmbarazo: a.madreCdInicioEmbarazo ?? "",
    madreAcidoFolicoAntesDuranteEmbarazo: a.madreAcidoFolicoAntesDuranteEmbarazo ? "si" : "no",
    madreCantidadCitasControlPrenatal: a.madreCantidadCitasControlPrenatal ?? "",
    madreSeguro: a.madreSeguro ?? "",

    padreLugarNacimiento: a.padreLugarNacimiento ?? "",
    padreEscolaridad: a.padreEscolaridad ?? "",
    padreEdad: a.padreEdad?.toString?.() ?? "",
    padreOcupacion: a.padreOcupacion ?? "",
    padreParentescoConPareja: a.padreParentescoConPareja ? "si" : "no",
    padreSeguro: a.padreSeguro ?? "",

    adiccionesAmbos: a.adiccionesAmbos ?? "",
    otroHijoConDTN: a.otroHijoConDTN ? "si" : "no",
    familiarConDTN: a.familiarConDTN ? "si" : "no",
    exposicionToxicosEmbarazo: a.exposicionToxicosEmbarazo ? "si" : "no",
    descripcionToxinas: a.descripcionToxinas ?? "",
  };
}


export async function POST(request: Request){
    const body = await request.json();
    const data = mapDetalleToForm(body);

    const res = await fetch("https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/asociados/editarAsociado",{
        method:"POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    console.log(res);
    if (res.ok){
        return Response.json({status: "ok"})
    }

    return Response.json({status: "fail"});
}