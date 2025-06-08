import { useAuth } from "@/core/contexts/auth.context"
import { LogOut, User, Users } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  if (!user) return null

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Sistema de Usuários</h1>
          <nav className="flex space-x-4">
            {user.role === "admin" && (
              <Link to="/users">
                <Button variant="ghost" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Usuários
                </Button>
              </Link>
            )}
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}
