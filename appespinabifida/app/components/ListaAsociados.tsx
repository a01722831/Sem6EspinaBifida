"use client";

import { useState } from "react";
import { useEffect} from "react";
import ListaTabla from "./ListaTabla";
import ModalAsociado from "./ModalAsociado";

type Estatus = "Activo" | "Inactivo" | "Pendiente";
type Sexo = "Masculino" | "Femenino";

interface ContactoEmergencia {
  nombre: string;
  telefono: string;
  relacion: string;
}

interface Asociado {
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
}

const badgeColors: Record<Estatus, string> = {
  Activo: "bg-green-600/10 text-green-600",
  Inactivo: "bg-red-500/10 text-red-500",
  Pendiente: "bg-yellow-600/10 text-yellow-600",
};

const HEADERS = ["ID", "Nombre", "Estatus", "Fecha de alta"];

interface Filters  {
  id: number|null,
  nombre: string,
  fecha: string,
  estatus: string
}

type passFilters = {
  filtros: Filters
}

export default function ListaAsociados({filtros}: passFilters) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [RawData, setRawData] = useState<Asociado[]>([]);
  const [Data, setData] = useState<Asociado[]>([]);

  useEffect(() => {
    const data = async () =>{
      const res = await fetch("/api/asociados/lista_asociados");
      if (res.ok){
        const data = await res.json();
        setRawData(data);
        setData(data);
      }
    }
    data();
  }, [])

  useEffect(() => {
    setData(RawData.filter(element => {
      let idFilter = false;
      let nombreFilter = false;
      let fechaFilter = false;
      let statusFilter = false;
      if (filtros.id == null || filtros.id == 0){
        idFilter = true;
      }
      else if (filtros.id == Number(element.id)){
        idFilter = true;
      }
      if (filtros.nombre == ""){
        nombreFilter = true;
      }
      else if (String(element.nombre).includes(filtros.nombre)){
        nombreFilter = true;
      }
      if (filtros.fecha == ""){
        fechaFilter = true;
      }
      else if (filtros.fecha == String(element.fechaAlta)){
        fechaFilter = true;
      }
      if (filtros.estatus == ""){
        statusFilter = true;
      }
      else if (filtros.estatus == String(element.estatus)){
        statusFilter = true;
      }
      return idFilter && nombreFilter && fechaFilter && statusFilter
    }));
  }, [filtros]);

  const rows = Data.map((row) => ({
    key: row.id,
    cells: [
      row.id,
      row.nombre,
      <span
        key="estatus"
        className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${badgeColors[row.estatus]}`}
      >
        {row.estatus}
      </span>,
      row.fechaAlta,
    ],
  }));

  const handleClose = () => setSelectedIndex(null);
  const handlePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };
  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < Data.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const selectedAsociado =
    selectedIndex !== null ? Data[selectedIndex] : null;

  return (
    <>
      <ListaTabla
        headers={HEADERS}
        rows={rows}
        onRowClick={setSelectedIndex}
      />
      {selectedAsociado != null && selectedIndex != null && (
        <ModalAsociado
          asociado={selectedAsociado}
          onClose={handleClose}
          onPrev={selectedIndex > 0 ? handlePrev : undefined}
          onNext={selectedIndex < Data.length - 1 ? handleNext : undefined}
        />
      )}
    </>
  );
}
