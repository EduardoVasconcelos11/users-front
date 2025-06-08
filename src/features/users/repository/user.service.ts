import { authService } from "../../auth/repository/auth.service"
import { ApiResponse, UpdateProfileData, User } from "../models/user"

class UserService {
  private baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  private getHeaders() {
    const token = authService.getToken()
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  async getAllUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        headers: this.getHeaders(),
      })

      const data = await response.json()
      return response.ok ? { success: true, data: data.data } : { success: false, error: data.message }
    } catch (error) {
      return { success: false, error: "Erro de conexão" }
    }
  }

  async updateProfile(userId: string, updateData: UpdateProfileData): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (response.ok) {
        // Atualizar o usuário no localStorage se for o usuário atual
        const currentUser = authService.getCurrentUser()
        if (currentUser && currentUser.id === userId) {
          localStorage.setItem("user", JSON.stringify(data.data))
        }
        return { success: true, data: data.data }
      }

      return { success: false, error: data.message }
    } catch (error) {
      return { success: false, error: "Erro de conexão" }
    }
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      })

      const data = await response.json()
      return response.ok ? { success: true } : { success: false, error: data.message }
    } catch (error) {
      return { success: false, error: "Erro de conexão" }
    }
  }

  async createUser(userData: { name: string; email: string; password: string; role: "admin" | "user" }): Promise<
    ApiResponse<User>
  > {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      return response.ok ? { success: true, data: data.data } : { success: false, error: data.message }
    } catch (error) {
      return { success: false, error: "Erro de conexão" }
    }
  }
}

export const userService = new UserService()
