export async function GET(){
    const res = await fetch("https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/asociados/obtenerListaAsociadosEstudio");
    if (res.ok){
        const data = (await res.json()).items;
        const returnData = data.map((asociado : any) => {
            return {
                id: asociado.id_asociado,
                nombre: asociado.nombre + " " + asociado.apellidos,
                edad: asociado.edad,
                genero: asociado.genero,
                telCel: asociado.telefono,
                telEmergencia: asociado.telefono_emergencia,
            }
        });
        const responseMessage = {
            status: "ok",
            data: returnData
        }
        return Response.json(responseMessage);
    }
    else{
        const responseMessage = {
            status: "fail",
            data: []
        }
        return Response.json(responseMessage)
    }
}