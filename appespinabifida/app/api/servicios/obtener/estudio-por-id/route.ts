import { NextResponse } from "next/server";

const ORDS_BASE_URL =
  "https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/obtenerEstudioPorId";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "El parametro id es obligatorio." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${ORDS_BASE_URL}?id=${encodeURIComponent(id)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "No fue posible consultar el estudio solicitado." },
        { status: response.status }
      );
    }

    const payload = await response.json();
    const item = payload?.items?.[0] ?? null;

    if (!item) {
      return NextResponse.json(
        { error: "No se encontro informacion para el estudio indicado." },
        { status: 404 }
      );
    }

    return NextResponse.json({ item });
  } catch {
    return NextResponse.json(
      { error: "Error inesperado al obtener los datos del estudio." },
      { status: 500 }
    );
  }
}
