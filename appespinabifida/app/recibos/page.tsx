"use client";

import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";
import {
	Printer,
	CreditCard,
	Banknote,
	Building2,
	ArrowRightLeft,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const METODOS_PAGO = [
	{
		id: "efectivo",
		nombre: "Efectivo",
		descripcion: "Pago en efectivo",
		icon: <Banknote className="h-5 w-5 text-slate-600" />,
	},
	{
		id: "tarjeta",
		nombre: "Tarjeta",
		descripcion: "Tarjeta débito/crédito",
		icon: <CreditCard className="h-5 w-5 text-slate-600" />,
	},
	{
		id: "deposito",
		nombre: "Depósito",
		descripcion: "Depósito bancario",
		icon: <Building2 className="h-5 w-5 text-slate-600" />,
	},
	{
		id: "transferencia",
		nombre: "Transferencia",
		descripcion: "Transferencia bancaria",
		icon: <ArrowRightLeft className="h-5 w-5 text-slate-600" />,
	},
];

const conceptos = [
	{
		id: 1,
		concepto: "Terapia Física - Rehabilitación",
		tipo: "Sesión",
		cantidad: 2,
		unitario: 450.0,
		total: 900.0,
	},
	{
		id: 2,
		concepto: "Consulta Neurología Pediátrica",
		tipo: "Servicio",
		cantidad: 1,
		unitario: 850.0,
		total: 850.0,
	},
	{
		id: 3,
		concepto: "Hidroterapia Especializada",
		tipo: "Sesión",
		cantidad: 3,
		unitario: 380.0,
		total: 1140.0,
	},
	{
		id: 4,
		concepto: "Estudios de Laboratorio",
		tipo: "Servicio",
		cantidad: 1,
		unitario: 650.0,
		total: 650.0,
	},
];

const totalRecibo = conceptos.reduce((sum, item) => sum + item.total, 0);

export default function RecibosPage() {
	const [sessionLoaded, setSessionLoaded] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getSession().then((session) => {
			setSessionLoaded(session);
			setLoading(false);
		});
	}, []);

	if (loading) {
		return (
			<div className="flex items-center justify-center py-24">
				<p className="text-slate-500">Cargando...</p>
			</div>
		);
	}

	if (!sessionLoaded) {
		return (
			<div className="flex items-center justify-center py-24">
				<p className="text-slate-500">No autorizado</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div>
					<h1 className="text-4xl font-semibold tracking-tight text-slate-800">
						Recibo #001
					</h1>
					<p className="mt-1 text-sm text-slate-500">ID: REC-2026-0001</p>
				</div>
				<Badge variant="success">PAGADO</Badge>
			</div>

			{/* Associate + Receipt Data */}
			<div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200/70">
				<div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
					<div>
						<h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
							Datos Asociado
						</h2>
						<div className="space-y-3">
							<div>
								<p className="text-xs uppercase text-slate-400">ID</p>
								<p className="text-base font-medium text-slate-800">
									EB-2024-0147
								</p>
							</div>
							<div>
								<p className="text-xs uppercase text-slate-400">Nombre</p>
								<p className="text-base font-medium text-slate-800">
									María Guadalupe Hernández Torres
								</p>
							</div>
						</div>
					</div>

					<div>
						<h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
							Datos de Recibo
						</h2>
						<div className="space-y-3">
							<div>
								<p className="text-xs uppercase text-slate-400">
									Fecha creación
								</p>
								<p className="text-base font-medium text-slate-800">
									13 de marzo de 2026
								</p>
							</div>
							<div>
								<p className="text-xs uppercase text-slate-400">Fecha límite</p>
								<p className="text-base font-medium text-slate-800">
									28 de marzo de 2026
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Conceptos Table */}
			<div className="rounded-2xl bg-white shadow-md ring-1 ring-slate-200/70">
				<div className="border-b border-slate-100 px-6 py-4">
					<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
						Conceptos
					</h2>
				</div>
				<div className="w-full overflow-x-auto">
					<table className="min-w-[640px] w-full border-collapse">
						<thead>
							<tr className="bg-slate-600 text-white">
								<th className="px-4 py-4 text-left text-sm font-semibold">
									#
								</th>
								<th className="px-4 py-4 text-left text-sm font-semibold">
									Concepto
								</th>
								<th className="px-4 py-4 text-left text-sm font-semibold">
									Tipo
								</th>
								<th className="px-4 py-4 text-center text-sm font-semibold">
									Cantidad
								</th>
								<th className="px-4 py-4 text-right text-sm font-semibold">
									Unitario
								</th>
								<th className="rounded-tr-2xl px-4 py-4 text-right text-sm font-semibold">
									Total
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-200">
							{conceptos.map((item) => (
								<tr key={item.id} className="transition hover:bg-slate-50">
									<td className="px-4 py-4 text-sm text-slate-800">
										{item.id}
									</td>
									<td className="px-4 py-4 text-sm font-medium text-slate-800">
										{item.concepto}
									</td>
									<td className="px-4 py-4 text-sm text-slate-600">
										{item.tipo}
									</td>
									<td className="px-4 py-4 text-center text-sm text-slate-800">
										{item.cantidad}
									</td>
									<td className="px-4 py-4 text-right text-sm text-slate-800">
										${item.unitario.toFixed(2)}
									</td>
									<td className="px-4 py-4 text-right text-sm font-medium text-slate-800">
										${item.total.toFixed(2)}
									</td>
								</tr>
							))}
							<tr className="bg-slate-50">
								<td
									colSpan={5}
									className="px-4 py-4 text-right text-sm font-semibold text-slate-700"
								>
									TOTAL
								</td>
								<td className="px-4 py-4 text-right text-base font-bold text-slate-800">
									${totalRecibo.toFixed(2)}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{/* Método de Pago */}
			<div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200/70">
				<h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
					Método de Pago
				</h2>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{METODOS_PAGO.map((metodo) => (
						<button
							key={metodo.id}
							type="button"
							className="flex flex-col items-center gap-3 rounded-xl border-2 border-slate-200 bg-slate-50 p-5 text-center transition hover:border-slate-400 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/70"
						>
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
								{metodo.icon}
							</span>
							<span className="text-xs font-semibold text-slate-800">
								{metodo.nombre}
							</span>
							<span className="text-center text-xs text-slate-500">
								{metodo.descripcion}
							</span>
						</button>
					))}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-wrap gap-3">
				<Button
					variant="secondary"
					leftIcon={<Printer className="h-4 w-4" />}
				>
					Imprimir
				</Button>
				<Button
					variant="secondary"
					leftIcon={<CreditCard className="h-4 w-4" />}
				>
					Registrar pago
				</Button>
				<Button
					variant="ghost"
					className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
				>
					Cancelar
				</Button>
			</div>
		</div>
	);
}
