export async function GET(request: Request){
    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/asociados/obtenerListaAsociados`);
    const response = await res.json();
    return Response.json(response.items);
}