export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/obtenerConsultaPorId?id=${searchParams.get("id")}`,{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${process.env.DB_USER}:${process.env.DB_PASSWORD}`).toString("base64"),
        }
    });
    const data = (await res.json()).items[0];
    return Response.json(data);
}