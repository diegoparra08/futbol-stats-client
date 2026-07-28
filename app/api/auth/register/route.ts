import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/services/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Petición al Backend 
  const registerRes = await fetch(`${API_BASE_URL}/api/Auth/Register`, {
    method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const registerData = await registerRes.json();

    if (!registerRes.ok || (registerData.succeeded === false)) {
      return NextResponse.json(
        { message: registerData.message || "Error al registrar el usuario." },
        { status: registerRes.status || 400 }
      );
    }

    const loginRes = await fetch(`${API_BASE_URL}/api/Auth/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });
    const loginData = await loginRes.json();

    if (!loginRes.ok || !loginData.token) {
      return NextResponse.json(
        { message: "Registro exitoso, pero falló el inicio de sesión automático. Por favor inicia sesión." },
        { status: 401 }
      );
    }
    const { token, email, name } = loginData;

    // generar la cookie
   const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60,  // 2 horas (en segundos)
      path: "/",
    });

    return NextResponse.json({
      succeeded: true,
      message: "Registro e inicio de sesión exitosos",
      user: { email, name },
    });
  } catch (error) {
    console.error("Error en /api/auth/register:", error);
    return NextResponse.json(
      { message: "Error de conexión con el servidor" },
      { status: 500 }
    );
  }
}