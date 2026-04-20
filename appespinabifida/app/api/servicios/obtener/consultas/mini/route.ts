export async function GET(){
    const res = await fetch("https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/obtenerConsultasMini",{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${process.env.DB_USER}:${process.env.DB_PASSWORD}`).toString("base64"),
        }
    });
    if (res.ok){
        const data = await res.json();
        const responseData = data.items.map((item: any) => {
            return {
                id: item.id_consulta,
                folio: "CON-" + String(item.id_consulta),
                tipo: "Consulta " + String(item.tipo_consulta),
                fecha: String(item.fecha)
            }
        })
        const response = {
            status: "ok",
            data: responseData
        }
        return Response.json(response);
    }
    else{
        const response  = {
            status: "fail",
            data: []
        }
        return Response.json(response);
    }
}