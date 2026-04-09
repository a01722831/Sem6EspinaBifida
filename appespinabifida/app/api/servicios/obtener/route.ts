import * as obtenerConsultas from "./consultas/route";
import * as obtenerEstudios from "./estudios/route";

export async function GET(){
    const res = await obtenerConsultas.GET();
    const res2 = await obtenerEstudios.GET();

    const result = await res.json();
    const result2 = await res2.json();
    const listaConsultas = result;
    const listaEstudios = result2;
    const response = {consultas: listaConsultas, estudios: listaEstudios}
    return Response.json(response);
}