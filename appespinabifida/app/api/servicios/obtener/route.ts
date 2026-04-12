import { serialize } from "v8";
import * as obtenerConsultas from "./consultas/route";
import * as obtenerEstudios from "./estudios/route";

type estudio_data = {
    id_estudio: number,
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
    id_consulta: number,
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
    estatus: string
}

export async function GET(){
    const res = await obtenerConsultas.GET();
    const res2 = await obtenerEstudios.GET();

    const result = await res.json();
    const result2 = await res2.json();
    const listaConsultas = result;
    const listaEstudios = result2;
    const servicios: (consulta_data | estudio_data)[] = [...listaConsultas, ...listaEstudios];

    servicios.sort((a,b) => {
        let a_val;
        let b_val;
        if ("id_consulta" in a){
            a_val = a.id_consulta;
        }
        else{
            a_val = a.id_estudio;
        }
        if ("id_consulta" in b){
            b_val = b.id_consulta;
        }
        else{
            b_val = b.id_estudio;
        }
        return a_val - b_val;
    })

    const response = {servicios};
    return Response.json(response);
}