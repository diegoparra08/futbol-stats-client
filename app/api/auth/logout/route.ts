import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Eliminamos la cookie sobreescribiéndola o borrándola
  cookieStore.delete("auth_token");

  return NextResponse.json({
    succeeded: true,
    message: "Sesión cerrada correctamente",
  });
}