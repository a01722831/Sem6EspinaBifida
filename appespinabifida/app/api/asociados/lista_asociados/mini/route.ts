export async function GET(){
    const res = await fetch("https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/asociados/obtenerListaAsociadosMini");
    const data = (await res.json()).items;
    return Response.json(data);
}