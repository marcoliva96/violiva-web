'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SimpleAdminPage() {
  const [email, setEmail] = useState('admin@violiva.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Simular login (sin base de datos)
    if (email === 'admin@violiva.com' && password === 'admin123') {
      setMessage('✅ Login exitoso! Redirigiendo...')
      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 1500)
    } else {
      setMessage('❌ Credenciales incorrectas')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Admin
          </h1>
          <p className="text-gray-600">
            Usa las credenciales por defecto para acceder
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes('✅') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg"
            style={{ minHeight: '48px' }}
          >
            {loading ? 'Iniciando sesión...' : '🚀 ACCEDER AL ADMIN'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Credenciales por defecto:
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Email: admin@violiva.com<br />
            Contraseña: admin123
          </p>
        </div>
      </div>
    </div>
  )
}
