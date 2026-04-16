export async function GET(){
    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/asociados/obtenerListaAsociados`);
    const response = (await res.json()).items;

    const ListaAsociados = response.map((asociado: any) => {
        
        function sentenceCase(text: String){
            if (text == null) return null;
            return text[0].toUpperCase() + text.slice(1);
        }

        const [birthDate, timeWithZ] = String(asociado.fecha_nacimiento).split("T");
        const [fechaAlta, _] = String(asociado.fecha_alta).split("T");
        const telephone_list = JSON.parse(asociado.telefonos);
        return {
            id: asociado.id_asociado,
            folio: "ASO-" + asociado.id_asociado,
            nombre: asociado.nombre + " "+ asociado.apellidos,
            fechaNacimiento: birthDate,
            sexo: asociado.sexo,
            curp: asociado.curp,
            direccion: asociado.calle + ", " + asociado.ciudad + ", " + asociado.estado + ", " + asociado.cp,
            telefonos: telephone_list.map((telefono: any) => telefono.telefono),
            contactoEmergencia: { nombre: "Sofía Ruiz Castro", telefono: "55 9753 8642", relacion: "Madre" },
            fechaAlta: fechaAlta,
            estatus: sentenceCase(asociado.activo)
        };
    })
    return Response.json(ListaAsociados);
}