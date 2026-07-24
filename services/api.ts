// services/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

 // Función que genera y retorna únicamente el encabezado de autorización con el token.

export const getAuthHeader = (): HeadersInit => {
  
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzIiwiZW1haWwiOiJkaWVnb0BnbWFpbC5jb20iLCJ1bmlxdWVfbmFtZSI6IkRpZWdvIEFsZWphbmRybyIsInJvbGUiOiJQbGF5ZXIiLCJuYmYiOjE3ODQ4NTUwMzMsImV4cCI6MTc4NDg1ODYzMywiaWF0IjoxNzg0ODU1MDMzLCJpc3MiOiJGdXRib2xTdGF0c1dpdGhGcmllbmRzIiwiYXVkIjoiTmV4dEpzRnJvbnRlbmQifQ.ek3I4MSuoQkbZjtAoW0i7o1K8rAAd0nPZZEKdSEYINo"; 

  //en el futuro debo cambiar esto para que obtenga el token de la sesion actual
  // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // se retorna el objeto con el token
  return token ? { "Authorization": `Bearer ${token}` } : {};
};