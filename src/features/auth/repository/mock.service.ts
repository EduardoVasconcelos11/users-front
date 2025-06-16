import { AuthResponse, LoginCredentials, RegisterData, UpdateProfileData, User } from "@/features/users/models/user"
import { v4 as uuidv4 } from "uuid"

// Dados mockados para teste
let users: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "ativo",
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    role: "user",
    status: "ativo",
    createdAt: new Date(2023, 1, 20).toISOString(),
    updatedAt: new Date(2023, 1, 20).toISOString(),
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "inativo",
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: "4",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    status: "ativo",
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 3, 5).toISOString(),
  },
  {
    id: "5",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "user",
    status: "ativo",
    createdAt: new Date(2023, 4, 12).toISOString(),
    updatedAt: new Date(2023, 4, 12).toISOString(),
  },
]

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class MockService {
  // Autenticação
  async login(credentials: LoginCredentials): Promise<AuthResponse | null> {
    await delay(800) // Simula latência de rede

    // Credenciais para teste
    // Admin: admin@example.com / password
    // User: user@example.com / password
    if (
      (credentials.email === "admin@example.com" && credentials.password === "password") ||
      (credentials.email === "user@example.com" && credentials.password === "password")
    ) {
      const user = users.find((u) => u.email === credentials.email)
      if (user) {
        return {
          user,
          token: "mock-jwt-token-" + Math.random().toString(36).substring(2),
        }
      }
    }
    return null
  }

  async register(userData: RegisterData): Promise<AuthResponse | null> {
    await delay(800)

    // Verificar se o email já existe
    if (users.some((u) => u.email === userData.email)) {
      return null
    }

    const newUser: User = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      role: "user", // Novos registros são sempre usuários regulares
      status: "ativo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)

    return {
      user: newUser,
      token: "mock-jwt-token-" + Math.random().toString(36).substring(2),
    }
  }

  // Usuários
  async getAllUsers(): Promise<User[]> {
    await delay(800)
    return [...users]
  }

  async updateUser(userId: string, updateData: UpdateProfileData): Promise<User | null> {
    await delay(800)

    const userIndex = users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return null

    const updatedUser = {
      ...users[userIndex],
      ...(updateData.name && { name: updateData.name }),
      updatedAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser
    return updatedUser
  }

  async deleteUser(userId: string): Promise<boolean> {
    await delay(800)

    const initialLength = users.length
    users = users.filter((u) => u.id !== userId)
    return users.length < initialLength
  }

  async createUser(userData: {
    name: string
    email: string
    password: string
    role: "admin" | "user"
  }): Promise<User | null> {
    await delay(800)

    // Verificar se o email já existe
    if (users.some((u) => u.email === userData.email)) {
      return null
    }

    const newUser: User = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: "ativo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    users.push(newUser)
    return newUser
  }

  // Login social (simulado)
  async socialLogin(provider: string): Promise<AuthResponse | null> {
    await delay(1000)

    // Simula login com Google ou Microsoft
    const randomUser = users[Math.floor(Math.random() * 2)] // Pega um dos dois primeiros usuários

    return {
      user: randomUser,
      token: `mock-${provider}-token-${Math.random().toString(36).substring(2)}`,
    }
  }
}

export const mockService = new MockService()
