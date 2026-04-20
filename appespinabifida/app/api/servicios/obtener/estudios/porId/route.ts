export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/obtenerEstudioPorId?id=${searchParams.get("id")}`,{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${process.env.DB_USER}:${process.env.DB_PASSWORD}`).toString("base64"),
        }
    });
    if (!res.ok) {
        return new Response(JSON.stringify({ error: "Error al obtener estudio" }), { status: res.status, headers: { "Content-Type": "application/json" } });
    }
    const result = await res.json();
    const data = result.items?.[0];
    if (!data) {
        return new Response(JSON.stringify({ error: "Estudio no encontrado" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    return Response.json(data);
}