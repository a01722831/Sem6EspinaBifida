export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
    });
  }

  const res = await fetch(
    `https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/asociados/fotoAsociado?id=${id}`,
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.DB_USER}:${process.env.DB_PASSWORD}`
          ).toString("base64"),
      },
    }
  );

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch image" }), {
      status: res.status,
    });
  }

  // ✅ FIX: parse JSON instead of arrayBuffer
  const data = await res.json();

  // ✅ extract actual image
  const imageBase64 = data?.items?.[0]?.foto;

  if (!imageBase64) {
    return new Response(JSON.stringify({ error: "No image found" }), {
      status: 404,
    });
  }

  return Response.json({
    id,
    image: imageBase64,
    mime: "image/png", // Oracle is returning PNG (iVBOR...)
  });
}