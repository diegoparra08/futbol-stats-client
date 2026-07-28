import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/services/api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Petición al Backend
    const response = await fetch(`${API_BASE_URL}/api/Auth/Login`, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Credenciales incorrectas" },
        { status: response.status || 401 }
      );
    }

    // Extraer el token de la respuesta
    const { token, email, name } = data;

    if (!token) {
      return NextResponse.json(
        { message: "No se recibió un token válido del servidor." },
        { status: 500 }
      );
    }

    //  Crear la Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true, // Inaccesible desde JavaScript (Protege contra XSS)
      secure: process.env.NODE_ENV === "production", // HTTPS en producción
      sameSite: "lax",
      maxAge: 2 * 60 * 60, // 2 horas (en segundos)
      path: "/",
    });

   return NextResponse.json({
      succeeded: true,
      message: "Sesión iniciada correctamente",
      user: { email, name },
    });
  } catch (error) {
    console.error("Error en /api/auth/login:", error);
    return NextResponse.json(
      { message: "Error de conexión con el servidor" },
      { status: 500 }
    );
  }
}