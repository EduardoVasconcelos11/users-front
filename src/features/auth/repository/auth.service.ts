import { ApiResponse, AuthResponse, LoginCredentials, RegisterData } from "@/features/users/models/user"

class AuthService {
  private baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        return { success: true, data: data.data }
      }

      return { success: false, error: data.message }
    } catch (error) {
      return { success: false, error: "Erro de conexão" }
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      return response.ok ? { success: true, data: data.data } : { success: false, error: data.message }
    } catch (error) {
      return { success: false, error: "Erro de conexão" }
    }
  }

  async loginWithGoogle(): Promise<ApiResponse<AuthResponse>> {
    // Implementação do login com Google
    return { success: false, error: "Não implementado" }
  }

  async loginWithMicrosoft(): Promise<ApiResponse<AuthResponse>> {
    // Implementação do login com Microsoft
    return { success: false, error: "Não implementado" }
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  getCurrentUser() {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null
    return userStr ? JSON.parse(userStr) : null
  }

  getToken(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem("token") : null
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
