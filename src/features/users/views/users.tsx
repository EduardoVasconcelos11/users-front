import { useState } from "react"
import { useUsers } from "../viewmodel/use-users"
import { toast } from "@/core/hooks/use-toast"
import { ProtectedRoute } from "@/core/components/protected-route"
import { Header } from "@/core/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/core/components/ui/dialog"
import { Button } from "@/core/components/ui/button"
import { Edit, Trash2, UserPlus } from "lucide-react"
import { Label } from "@/core/components/ui/label"
import { Input } from "@/core/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/core/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/core/components/ui/table"
import { Badge } from "@/core/components/ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/core/components/ui/alert-dialog"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { userService } from "../repository/user.service"

export function UsersView() {
  const {
    users,
    isLoading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    sortBy,
    setSortBy,
    deleteUser,
    createUser,
    refetch,
  } = useUsers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)

  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "user",
    status: "ativo" as "ativo" | "inativo",
  })

  const [isCreating, setIsCreating] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const getRoleColor = (role: string) => {
    return role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
  }

  const getStatusColor = (status: string) => {
    return status === "ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  }

  const handleEditUser = (user: any) => {
    setIsModalOpen(true)
    setIsEditing(true)
    setEditingUserId(user.id)
    setNewUserForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    })
  }

  const handleSubmitUser = async () => {
    const errors: Record<string, string> = {}

    if (!newUserForm.name.trim()) {
      errors.name = "Nome é obrigatório"
    } else if (newUserForm.name.length < 2) {
      errors.name = "Nome deve ter pelo menos 2 caracteres"
    }

    if (!newUserForm.email.trim()) {
      errors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(newUserForm.email)) {
      errors.email = "Email inválido"
    }

    if (!isEditing) {
      if (!newUserForm.password.trim()) {
        errors.password = "Senha é obrigatória"
      } else if (newUserForm.password.length < 6) {
        errors.password = "Senha deve ter pelo menos 6 caracteres"
      }
    }

    setFormErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsCreating(true)
    try {
      if (isEditing && editingUserId) {
        const updatePayload: any = {
          name: newUserForm.name,
          email: newUserForm.email,
          role: newUserForm.role,
          status: newUserForm.status,
        }

        if (newUserForm.password.trim()) {
          updatePayload.password = newUserForm.password
        }

        const response = await userService.updateUser(editingUserId, updatePayload)

        if (response.success) {
          toast({ title: "Usuário atualizado", description: "Dados atualizados com sucesso" })
          refetch()
        } else {
          toast({
            title: "Erro ao atualizar usuário",
            description: response.error || "Erro interno",
            variant: "destructive",
          })
        }
      } else {
        const response = await userService.createUser(newUserForm)
        if (response.success) {
          toast({ title: "Usuário criado", description: "Usuário foi criado com sucesso" })
          refetch()
        } else {
          toast({
            title: "Erro ao criar usuário",
            description: response.error || "Erro interno",
            variant: "destructive",
          })
        }
      }

      setIsModalOpen(false)
      setNewUserForm({ name: "", email: "", password: "", role: "user", status: "ativo" })
      setFormErrors({})
      setEditingUserId(null)
      setIsEditing(false)
    } catch {
      toast({
        title: "Erro interno",
        description: "Erro interno do servidor",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-2xl font-bold">Gerenciar Usuários</CardTitle>
                <Dialog
                  open={isModalOpen}
                  onOpenChange={(open) => {
                    setIsModalOpen(open)
                    if (!open) {
                      setIsEditing(false)
                      setEditingUserId(null)
                      setFormErrors({})
                      setNewUserForm({ name: "", email: "", password: "", role: "user", status: "ativo" })
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{isEditing ? "Editar Usuário" : "Criar Novo Usuário"}</DialogTitle>
                      <DialogDescription>
                        {isEditing
                          ? "Atualize os dados do usuário selecionado."
                          : "Preencha os dados para criar um novo usuário no sistema."}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="modal-name">Nome</Label>
                        <Input
                          id="modal-name"
                          value={newUserForm.name}
                          onChange={(e) => setNewUserForm((prev) => ({ ...prev, name: e.target.value }))}
                        />
                        {formErrors.name && <p className="text-sm text-red-600">{formErrors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="modal-email">Email</Label>
                        <Input
                          id="modal-email"
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) => setNewUserForm((prev) => ({ ...prev, email: e.target.value }))}
                        />
                        {formErrors.email && <p className="text-sm text-red-600">{formErrors.email}</p>}
                      </div>

                      {!isEditing && (
                        <div className="space-y-2">
                          <Label htmlFor="modal-password">Senha</Label>
                          <Input
                            id="modal-password"
                            type="password"
                            value={newUserForm.password}
                            onChange={(e) => setNewUserForm((prev) => ({ ...prev, password: e.target.value }))}
                          />
                          {formErrors.password && <p className="text-sm text-red-600">{formErrors.password}</p>}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="modal-role">Papel</Label>
                        <Select
                          value={newUserForm.role}
                          onValueChange={(value: "admin" | "user") =>
                            setNewUserForm((prev) => ({ ...prev, role: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Usuário</SelectItem>
                            <SelectItem value="admin">Administrador</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="modal-status">Status</Label>
                        <Select
                          value={newUserForm.status}
                          onValueChange={(value: "ativo" | "inativo") =>
                            setNewUserForm((prev) => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsModalOpen(false)
                          setIsEditing(false)
                          setEditingUserId(null)
                          setFormErrors({})
                          setNewUserForm({ name: "", email: "", password: "", role: "user", status: "ativo" })
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSubmitUser} disabled={isCreating}>
                        {isCreating ? (isEditing ? "Salvando..." : "Criando...") : isEditing ? "Salvar Alterações" : "Criar Usuário"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Papel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role === "admin" ? "Administrador" : "Usuário"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status === "ativo" ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o usuário {user.name}? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteUser(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
