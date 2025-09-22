'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import AdminDashboard from '@/components/AdminDashboard'
import { LoginForm } from '@/components/LoginForm'
import { Loader2 } from 'lucide-react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== 'loading') {
      setLoading(false)
    }
  }, [status])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <LoginForm />
  }

  return <AdminDashboard />
}
