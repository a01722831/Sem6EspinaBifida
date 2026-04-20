export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const resEstudios = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/estudiosConsulta?id=${searchParams.get("id")}`,{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${process.env.DB_USER}:${process.env.DB_PASSWORD}`).toString("base64"),
        }
    });
    const listaEstudios = (await resEstudios.json()).items;
    return Response.json(listaEstudios);
}