import type React from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/auth.context"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "user"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login")
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        navigate("/unauthorized")
        return
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
