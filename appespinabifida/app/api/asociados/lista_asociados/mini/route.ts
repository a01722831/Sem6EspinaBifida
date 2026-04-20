export async function GET(){
    const res = await fetch("https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/asociados/obtenerListaAsociadosMini",{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`admin:Biologia06***`).toString("base64"),
        }
    });
    const data = (await res.json()).items;
    return Response.json(data);
}