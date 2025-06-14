export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  status: "ativo" | "inativo"
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export type UpdateProfileData = {
  name?: string
  password?:string
  email?: string
  role?: "admin" | "user"
}


export interface AuthResponse {
  user: User
  token: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
