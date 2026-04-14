type agregar_servicio_data = {
    tipo: number,
    data: estudio_data | consulta_data
}

type estudio_data = {
    id_asociado: number,
    id_medico: number,
    id_tipo_estudio: number,
    laboratorio: string,
    aportacion: number,
    ya_aporto: 1 | 0,
    fecha_cita: string,
    estatus: string,
    resultados: string
}

type consulta_data = {
    id_asociado: number,
    id_medico: number,
    id_estudio: number,
    id_recibo: number,
    tipo_consulta: "primera" | "seguimiento",
    motivo: string,
    diagnostico: string,
    tratamiento: string,
    aportacion: number,
    ya_aporto: 1 | 0,
    estatus: string,
    fecha_cita: string
}

export async function POST(request: Request){

    const body: agregar_servicio_data = await request.json();

    const url = (body.tipo == 0)? "https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/agregarConsulta" : "https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/agregarEstudio";
    console.log(url);
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body.data),
    });
    console.log(res);
    const insert_response = (res.ok) ? "Success" : "Failed";
    return Response.json(insert_response);
}