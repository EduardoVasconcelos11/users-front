import { useState } from "react"
import { useAuth } from "@/core/contexts/auth.context"
import { useToast } from "@/core/hooks/use-toast"
import { UpdateProfileData } from "../models/user"
import { userService } from "@/features/users/repository/user.service"

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { user, login } = useAuth()
  const { toast } = useToast()

  const validateForm = (data: UpdateProfileData): boolean => {
    const newErrors: Record<string, string> = {}

    if (data.name && data.name.length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres"
    }

    if (data.password && data.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateProfile = async (data: UpdateProfileData) => {
    if (!user || !validateForm(data)) return

    setIsLoading(true)
    try {
      // const response = await userService.updateProfile(user.id, data)

      // if (response.success && response.data) {
        // Atualizar o usuário no contexto
        // login(response.data, localStorage.getItem("token") || "")
      //   toast({
      //     title: "Perfil atualizado",
      //     description: "Suas informações foram atualizadas com sucesso",
      //   })
      // } else {
      //   toast({
      //     title: "Erro ao atualizar perfil",
      //     description: response.error || "Erro interno",
      //     variant: "destructive",
      //   })
      // }
      console.log('funfou');
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Erro interno do servidor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    errors,
    updateProfile,
  }
}
