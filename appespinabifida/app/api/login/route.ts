import bcrypt from "bcryptjs";

type login = {
    user: string,
    password: string
};

export async function POST(request: Request){

    const body: login = await request.json();
    const user = body.user;
    const password = body.password;

    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/user/login?userName=${user}`);

    const result = await res.json();
    const hashToCompare = result.items[0].password_hash;
    const isValid = (hashToCompare) ? await bcrypt.compare(password, hashToCompare) : false;
    return Response.json(isValid);
};

export async function getUserByEmail(email: any){
    
    const res = await fetch(`https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/user/getUserbyEmail?email=${email}`);
    const data = await res.json();
    if (!data.items[0]){
        return null;
    }
    return data.items[0];
};

export async function createUser(data: any){
    const res = await fetch("https://g53bc679c5acb2c-espinabd.adb.mx-queretaro-1.oraclecloudapps.com/ords/admin/user/addGoogleUser",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: data.email,
            provider: data.provider,
            passhash: data.password
        }),
        
    });
    console.log(res);
    if (res.ok){
        console.log("Success");
        return true;
    }
    return false;
}