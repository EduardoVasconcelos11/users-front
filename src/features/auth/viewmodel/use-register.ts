import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/core/hooks/use-toast"
import { RegisterData } from "@/features/users/models/user"
import { authService } from "../repository/auth.service"

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const { toast } = useToast()

  const validateForm = (data: RegisterData): boolean => {
    const newErrors: Record<string, string> = {}

    if (!data.name) {
      newErrors.name = "Nome é obrigatório"
    } else if (data.name.length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres"
    }

    if (!data.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newErrors.email = "Email inválido"
    }

    if (!data.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (data.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async (data: RegisterData) => {
    if (!validateForm(data)) return

    setIsLoading(true)
    try {
      const response = await authService.register(data)

      if (response.success) {
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Você pode fazer login agora.",
        })
        navigate("/login")
      } else {
        toast({
          title: "Erro no cadastro",
          description: response.error || "Erro ao criar conta",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Erro interno do servidor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    errors,
    handleRegister,
  }
}
