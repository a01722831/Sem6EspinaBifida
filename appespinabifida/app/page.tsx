"use client";

import { useState } from "react";

export default function TestLogin() {
  const [result, setResult] = useState<string>("");

  async function testLogin() {
    const ejemplo = {
      tipo: 1,
      data: {
      "id_estudio": 1,
      "id_asociado": 10,
      "id_medico": 5,
      "id_tipo_estudio": 2,
      "laboratorio": "Lab Central",
      "aportacion": 200,
      "ya_aporto": 1,
      "fecha_cita": "2026-04-10T10:30:00",
      "estatus": "pendiente",
      "resultados": "N/A"
    }
    };
    try {
      const res = await fetch("/api/servicios/editar",{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ejemplo)
      });
      console.log(res.body);
      setResult(JSON.stringify(await res.json()));
    } catch (err) {
      console.error(err);
      setResult("Error calling API");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Login</h1>

      <button onClick={testLogin} style={{ padding: "10px 20px" }}>
        Test Login
      </button>

      <p>{result}</p>
    </div>
  );
}
