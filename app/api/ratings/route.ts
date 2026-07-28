import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/services/api";

//aca se maneja el proxy de la api de ratings para crear un rating unicamente
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { succeeded: false, message: "No autorizado. Token inexistente." },
        { status: 401 }
      );
    }

    const body = await request.text();

    const response = await fetch(`${API_BASE_URL}/api/Rating`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
      cache: "no-store",
    });

    const textData = await response.text();
    let data;
    try {
      data = textData ? JSON.parse(textData) : {};
    } catch {
      data = { message: textData };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error en POST /api/ratings:", error);
    return NextResponse.json(
      { succeeded: false, message: "Error interno en el servidor proxy" },
      { status: 500 }
    );
  }
}