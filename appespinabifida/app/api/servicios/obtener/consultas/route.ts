export async function GET(){
    
    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/obtenerConsultas`);
    const result = await res.json();
    const listaConsultas = result.items;
    return Response.json(listaConsultas);
}