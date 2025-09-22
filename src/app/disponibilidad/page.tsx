'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

interface BusyDate {
  date: string
  venue?: string
  pack: string
  state: string
}

export default function DisponibilidadPage() {
  const [busyDates, setBusyDates] = useState<BusyDate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  useEffect(() => {
    fetchBusyDates()
  }, [selectedMonth])

  const fetchBusyDates = async () => {
    try {
      const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1)
      const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0)
      
      const response = await fetch(
        `/api/calendar?from=${startDate.toISOString().split('T')[0]}&to=${endDate.toISOString().split('T')[0]}`
      )
      
      if (response.ok) {
        const data = await response.json()
        setBusyDates(data)
      }
    } catch (error) {
      console.error('Error fetching busy dates:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    // Adjust for Monday start (0 = Sunday, 1 = Monday)
    const mondayStart = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1
    for (let i = 0; i < mondayStart; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const isDateBusy = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return busyDates.some(busyDate => busyDate.date === dateString)
  }

  const getBusyDateInfo = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    return busyDates.find(busyDate => busyDate.date === dateString)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(selectedMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setSelectedMonth(newMonth)
  }

  const days = getDaysInMonth(selectedMonth)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando disponibilidad...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                Disponibilidad
              </h1>
              <p className="text-gray-600">
                Consulta las fechas disponibles para tu boda
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => navigateMonth('prev')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <h2 className="text-2xl font-serif font-bold text-gray-900 capitalize">
              {getMonthName(selectedMonth)}
            </h2>
            
            <Button
              variant="outline"
              onClick={() => navigateMonth('next')}
              className="flex items-center"
            >
              Siguiente
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="p-3 text-center font-semibold text-gray-600">
                {day}
              </div>
            ))}
            
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-3"></div>
              }
              
              const isBusy = isDateBusy(day)
              const busyInfo = getBusyDateInfo(day)
              const isToday = day.toDateString() === new Date().toDateString()
              
              return (
                <div
                  key={day.toISOString()}
                  className={`p-3 text-center rounded-lg border-2 transition-colors ${
                    isBusy
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-green-50 border-green-200 text-green-700'
                  } ${
                    isToday ? 'ring-2 ring-amber-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {isBusy ? (
                      <XCircle className="h-4 w-4 mr-1" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                  </div>
                  <div className="text-sm font-medium">{day.getDate()}</div>
                  {isBusy && busyInfo && (
                    <div className="text-xs mt-1">
                      {busyInfo.pack}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-gray-600">Ocupado</span>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-amber-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-amber-600" />
            Información importante
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Disponibilidad</h4>
              <p className="text-sm text-gray-600 mb-4">
                Las fechas marcadas en verde están disponibles para tu boda. 
                Las fechas en rojo ya están ocupadas.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Reserva</h4>
              <p className="text-sm text-gray-600 mb-4">
                Para reservar una fecha, configura tu boda y envíanos la solicitud. 
                Te confirmaremos la disponibilidad en menos de 24 horas.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
              <Link href="/configura">
                Configurar mi boda
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
