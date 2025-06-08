import { InfoIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

export function LoginInstructions() {
  return (
    <Alert className="mb-6">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Credenciais para teste</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-1">
          <strong>Admin:</strong> admin@example.com / password
        </p>
        <p>
          <strong>Usuário:</strong> user@example.com / password
        </p>
      </AlertDescription>
    </Alert>
  )
}
