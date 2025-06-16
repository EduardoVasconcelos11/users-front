import React from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle } from "lucide-react"

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow text-center">
        <div className="px-6 py-4 border-b">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold">Acesso Negado</h2>
          <p className="text-sm text-gray-500">Você não tem permissão para acessar esta página.</p>
        </div>
        <div className="px-6 py-4">
          <button
            onClick={() => navigate("/profile")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Voltar ao Perfil
          </button>
        </div>
      </div>
    </div>
  )
}
