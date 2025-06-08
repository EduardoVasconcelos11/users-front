// App.tsx
import LoginPage from "@/pages/LoginPage"
import ProfilePage from "@/pages/ProfilePage"
import RegisterPage from "@/pages/RegisterPage"
import UnauthorizedPage from "@/pages/UnauthorizedPage"
import UsersPage from "@/pages/UsersPage"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"


function App() {
  return (
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}

        {/* Rotas protegidas */}
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Rota 404 */}
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
  )
}

export default App
