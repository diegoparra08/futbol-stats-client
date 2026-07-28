import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/services/api";


async function handleProxyRequest(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    // Extraer la cookie auth_token
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { succeeded: false, message: "No autorizado. Token inexistente." },
        { status: 401 }
      );
    }

    // Reconstruir la ruta destino hacia el backend
    const targetPath = path ? path.join("/") : "";
    const { search } = new URL(request.url);
    const destinationUrl = `${API_BASE_URL}/api/Rating/${targetPath}${search}`;

    // Preparar headers con el Token de la cookie
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
      cache: "no-store",
    };

    // Si la petición trae Body (POST/PUT), reenviarlo
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const body = await request.text();
      if (body) fetchOptions.body = body;
    }

    const response = await fetch(destinationUrl, fetchOptions);

    // Intentar responder en JSON si el backend responde con contenido
    const textData = await response.text();
    let data;
    try {
      data = textData ? JSON.parse(textData) : {};
    } catch {
      data = { message: textData };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error en Proxy Ratings:", error);
    return NextResponse.json(
      { succeeded: false, message: "Error interno en el proxy servidor" },
      { status: 500 }
    );
  }
}

// Exportar todos los HTTP necesarios
export const GET = handleProxyRequest;
export const POST = handleProxyRequest;
export const PUT = handleProxyRequest;