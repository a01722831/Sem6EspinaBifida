export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/obtenerConsultaPorId?id=${searchParams.get("id")}`);
    const data = (await res.json()).items[0];
    return Response.json(data);
}