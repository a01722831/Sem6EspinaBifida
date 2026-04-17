export async function GET(){
    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/medicos/obtenerMedicos`);
    const response = await res.json();
    return Response.json(response.items);
}