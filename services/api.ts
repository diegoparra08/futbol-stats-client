// services/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

 // Función que genera y retorna únicamente el encabezado de autorización con el token.

export const getAuthHeader = (): HeadersInit => {
  
  const token = "token quemado por el momento/ se cambiara cuando se implemente la autenticacion"; 

  //en el futuro debo cambiar esto para que obtenga el token de la sesion actual
  // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // se retorna el objeto con el token
  return token ? { "Authorization": `Bearer ${token}` } : {};
};