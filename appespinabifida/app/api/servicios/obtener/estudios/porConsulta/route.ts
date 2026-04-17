export async function GET(request: Request){
    const { searchParams } = new URL(request.url);
    const resEstudios = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/services/estudiosConsulta?id=${searchParams.get("id")}`);
    const listaEstudios = (await resEstudios.json()).items;
    return Response.json(listaEstudios);
}