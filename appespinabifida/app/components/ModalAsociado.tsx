"use client";

import { useState } from "react";

type Estatus = "Activo" | "Inactivo" | "Pendiente";
type Sexo = "Masculino" | "Femenino";

interface ContactoEmergencia {
  nombre: string;
  telefono: string;
  relacion: string;
}

interface AsociadoDetalle {
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

interface ModalAsociadoProps {
  asociado: AsociadoDetalle;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const tabs = ["Datos generales", "Historial", "Historial padres", "Credencial"];

const badgeColors: Record<Estatus, string> = {
  Activo: "bg-green-600 text-white",
  Inactivo: "bg-red-500 text-white",
  Pendiente: "bg-yellow-500 text-white",
};

export default function ModalAsociado({
  asociado,
  onClose,
  onPrev,
  onNext,
}: ModalAsociadoProps) {
  const [activeTab, setActiveTab] = useState("Datos generales");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={onPrev}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#003c64]"
              aria-label="Anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>

            <div>
              <h2 className="text-xl font-semibold text-[#003c64]">
                {asociado.nombre}
              </h2>
              <p className="text-sm text-gray-500">Folio: {asociado.folio}</p>
            </div>

            <button
              onClick={onNext}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-[#003c64]"
              aria-label="Siguiente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-[#003c64] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "Datos generales" && (
            <div className="bg-[#003c64]/5 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#003c64] mb-6">
                Datos Generales
              </h3>

              <div className="grid grid-cols-2 gap-y-5 gap-x-12">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Nombre completo</p>
                  <p className="text-sm font-medium text-gray-900">
                    {asociado.nombre}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Fecha de nacimiento</p>
                  <p className="text-sm font-medium text-gray-900">
                    {asociado.fechaNacimiento}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Sexo</p>
                  <p className="text-sm font-medium text-gray-900">
                    {asociado.sexo}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">CURP</p>
                  <p className="text-sm font-medium text-gray-900">
                    {asociado.curp}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-gray-500 mb-1">Dirección</p>
                  <p className="text-sm font-medium text-gray-900">
                    {asociado.direccion}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Teléfonos</p>
                  <p className="text-sm font-medium text-gray-900">
                    {asociado.telefonos.join(" / ")}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Contacto de emergencia</p>
                  <p className="text-sm font-medium text-gray-900">
                    {asociado.contactoEmergencia.nombre}
                  </p>
                  <p className="text-xs text-gray-600">
                    {asociado.contactoEmergencia.telefono} ({asociado.contactoEmergencia.relacion})
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Fecha de alta</p>
                  <p className="text-sm font-medium text-gray-900">
                    {asociado.fechaAlta}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Estatus</p>
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${badgeColors[asociado.estatus]}`}
                  >
                    {asociado.estatus}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Historial" && (
            <div className="bg-[#003c64]/5 rounded-xl p-6 min-h-[200px] flex items-center justify-center">
              <p className="text-gray-500">Historial del asociado</p>
            </div>
          )}

          {activeTab === "Historial padres" && (
            <div className="bg-[#003c64]/5 rounded-xl p-6 min-h-[200px] flex items-center justify-center">
              <p className="text-gray-500">Historial de padres</p>
            </div>
          )}

          {activeTab === "Credencial" && (
            <div className="bg-[#003c64]/5 rounded-xl p-6 min-h-[200px] flex items-center justify-center">
              <p className="text-gray-500">Credencial del asociado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
