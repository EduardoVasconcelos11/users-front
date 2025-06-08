import { authService } from "@/features/auth/repository/auth.service"
import { User } from "@/features/users/models/user"
import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um usuário no localStorage
    try {
      const currentUser = authService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Erro ao recuperar usuário:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = (userData: User, token: string) => {
    setUser(userData)
    // O token já é salvo no authService.login
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
