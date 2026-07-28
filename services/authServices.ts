export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    console.log("login", credentials);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    console.log("response", response);
    const data = await response.json();
    console.log("token recibido en login", data);
    if (!response.ok) throw new Error(data.message || "Error al iniciar sesión");
    return data;
  },

  async register(credentials: RegisterCredentials) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
   
    if (!response.ok) throw new Error(data.message || "Error al registrarse");
    return data;
  },

  async logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    return await response.json();
  },
};