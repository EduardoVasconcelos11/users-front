import { useState, useEffect } from "react"
import { User } from "../models/user"
import { useToast } from "@/core/hooks/use-toast"
import { userService } from "@/features/users/repository/user.service"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all")
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name")
  const { toast } = useToast()

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // const response = await userService.getAllUsers()
      // if (response.success && response.data) {
        // setUsers(response.data)
        // setFilteredUsers(response.data)
      // } else {
      //   toast({
      //     title: "Erro ao carregar usuários",
      //     description: response.error || "Erro interno",
      //     variant: "destructive",
      //   })
      // }
      console.log('funfou');
    } catch (error) {
      toast({
        title: "Erro ao carregar usuários",
        description: "Erro interno do servidor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      // const response = await userService.deleteUser(userId)
      // if (response.success) {
      //   setUsers((prev) => prev.filter((user) => user.id !== userId))
      //   setFilteredUsers((prev) => prev.filter((user) => user.id !== userId))
      //   toast({
      //     title: "Usuário excluído",
      //     description: "Usuário foi excluído com sucesso",
      //   })
      // } else {
      //   toast({
      //     title: "Erro ao excluir usuário",
      //     description: response.error || "Erro interno",
      //     variant: "destructive",
      //   })
      // }
      console.log('funfou');
    } catch (error) {
      toast({
        title: "Erro ao excluir usuário",
        description: "Erro interno do servidor",
        variant: "destructive",
      })
    }
  }

  const createUser = async (userData: { name: string; email: string; password: string; role: "admin" | "user" }) => {
    try {
      const response = await userService.createUser(userData)
      if (response.success && response.data) {
        setUsers((prev) => [...prev, response.data!])
        setFilteredUsers((prev) => [...prev, response.data!])
        toast({
          title: "Usuário criado",
          description: "Usuário foi criado com sucesso",
        })
        return { success: true }
      } else {
        toast({
          title: "Erro ao criar usuário",
          description: response.error || "Erro interno",
          variant: "destructive",
        })
        return { success: false, error: response.error }
      }
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Erro interno do servidor",
        variant: "destructive",
      })
      return { success: false, error: "Erro interno do servidor" }
    }
  }

  const applyFilters = () => {
    let filtered = [...users]

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtro por papel
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter)
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredUsers(filtered)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, searchTerm, roleFilter, sortBy])

  return {
    users: filteredUsers,
    isLoading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    sortBy,
    setSortBy,
    deleteUser,
    createUser,
    refetch: fetchUsers,
  }
}
