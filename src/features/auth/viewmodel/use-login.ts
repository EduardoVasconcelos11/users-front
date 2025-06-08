import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/core/contexts/auth.context"
import { useToast } from "@/core/hooks/use-toast"
import { LoginCredentials } from "@/features/users/models/user"
import { authService } from "../repository/auth.service"

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast } = useToast()

  const validateForm = (credentials: LoginCredentials): boolean => {
    const newErrors: Record<string, string> = {}

    if (!credentials.email) {
      newErrors.email = "Email é obrigatório"
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Email inválido"
    }

    if (!credentials.password) {
      newErrors.password = "Senha é obrigatória"
    } else if (credentials.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    if (!validateForm(credentials)) return

    setIsLoading(true)
    try {
      // const response = await authService.login(credentials)

      // if (response.success && response.data) {
      //   login(response.data.user, response.data.token)
      //   toast({
      //     title: "Login realizado com sucesso!",
      //     description: `Bem-vindo, ${response.data.user.name}!`,
      //   })

        // Redirecionar baseado no papel do usuário
        // if (response.data.user.role === "admin") {
        navigate("/users")
        // } else {
        //   router.push("/profile")
        // }
      // } else {
      //   toast({
      //     title: "Erro no login",
      //     description: response.error || "Credenciais inválidas",
      //     variant: "destructive",
      //   })
      // }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Erro interno do servidor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: "google" | "microsoft") => {
    setIsLoading(true)
    try {
      // const response =
      //   provider === "google" ? await authService.loginWithGoogle() : await authService.loginWithMicrosoft()

      // if (response.success && response.data) {
      //   login(response.data.user, response.data.token)
      //   router.push(response.data.user.role === "admin" ? "/users" : "/profile")
      // } else {
      //   toast({
      //     title: "Erro no login social",
      //     description: response.error || "Erro ao fazer login",
      //     variant: "destructive",
      //   })
      // }
    } catch (error) {
      toast({
        title: "Erro no login social",
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
    handleLogin,
    handleSocialLogin,
  }
}
