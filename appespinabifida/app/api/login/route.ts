import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/db/user";

type login = {
    user: string,
    password: string
};

export async function POST(request: Request){

    const body: login = await request.json();
    const user = body.user;
    const password = body.password;

    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/user/login?userName=${user}`,{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${process.env.DB_USER}:${process.env.DB_PASSWORD}`).toString("base64"),
        }
    });

    const result = await res.json();
    const hashToCompare = result.items[0].password_hash;
    const isValid = (hashToCompare) ? await bcrypt.compare(password, hashToCompare) : false;
    return Response.json(isValid);
};
