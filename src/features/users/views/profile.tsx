import type React from "react"
import { useState } from "react"
import { User, Mail, Calendar, Shield, Lock } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useProfile } from "../viewmodel/use-profile"
import { UpdateProfileData } from "../models/user"
import { ProtectedRoute } from "@/core/components/protected-route"
import { Header } from "@/core/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Label } from "@/core/components/ui/label"
import { Badge } from "@/core/components/ui/badge"
import { Button } from "@/core/components/ui/button"
import { Input } from "@/core/components/ui/input"

export function ProfileView() {
  const { user, isLoading, errors, updateProfile } = useProfile()
  console.log("user", user)
  console.log("isLoading", isLoading)
  console.log("errors", errors)

  const [formData, setFormData] = useState<UpdateProfileData>({
    name: "",
    password: "",
  })
  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Filtrar campos vazios
    const dataToUpdate: UpdateProfileData = {}
    if (formData.name?.trim()) dataToUpdate.name = formData.name.trim()
    if (formData.password?.trim()) dataToUpdate.password = formData.password.trim()

    if (Object.keys(dataToUpdate).length > 0) {
      await updateProfile(dataToUpdate)
      setFormData({ name: "", password: "" })
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setFormData({ name: "", password: "" })
    setIsEditing(false)
  }

  if (!user) return null

  return (
    // <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      <div> teste </div>
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Informações do Perfil */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Meu Perfil
              </CardTitle>
              <CardDescription>Visualize e edite suas informações pessoais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <User className="w-4 h-4" />
                    Nome
                  </Label>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <p className="text-lg">{user.email}</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Shield className="w-4 h-4" />
                    Papel
                  </Label>
                  <Badge className={user.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}>
                    {user.role === "admin" ? "Administrador" : "Usuário"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <Calendar className="w-4 h-4" />
                    Membro desde
                  </Label>
                  <p className="text-lg">{format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={() => setIsEditing(true)} disabled={isEditing}>
                  Editar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Edição */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Editar Informações
                </CardTitle>
                <CardDescription>
                  Atualize seu nome ou senha. Deixe os campos em branco para não alterar.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Novo Nome (opcional)</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={user.name}
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Nova Senha (opcional)</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Digite uma nova senha"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  )
}
