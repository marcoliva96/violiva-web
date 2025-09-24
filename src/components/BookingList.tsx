'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Euro, User, Phone, Mail } from 'lucide-react'

interface Booking {
  id: string
  date: string
  venue?: string
  pack: string
  priceCents: number
  currency: string
  state: string
  client: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  selections: Array<{
    song?: {
      title: string
      composer?: string
    }
    customTitle?: string
  }>
  contract?: {
    id: string
    generatedAt: string
    sentAt?: string
    signedAt?: string
  }
}

interface BookingListProps {
  bookings: Booking[]
  onBookingSelect: (booking: Booking) => void
  selectedBooking: Booking | null
}

export function BookingList({ bookings, onBookingSelect, selectedBooking }: BookingListProps) {
  const [filter, setFilter] = useState('ALL')

  const getStateColor = (state: string) => {
    switch (state) {
      case 'CONTACTED':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PAID':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'CONTACTED':
        return 'Contactado'
      case 'CONFIRMED':
        return 'Confirmada'
      case 'PAID':
        return 'Pagada'
      case 'COMPLETED':
        return 'Completada'
      case 'CANCELLED':
        return 'Cancelada'
      default:
        return state
    }
  }

  const filteredBookings = filter === 'ALL' 
    ? bookings 
    : bookings.filter(booking => booking.state === filter)

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Reservas</h2>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'CONTACTED', 'NEGOTIATING', 'CONFIRMED', 'PAID', 'REALIZED', 'CANCELLED'].map((state) => (
            <Button
              key={state}
              variant={filter === state ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(state)}
              className={filter === state ? 'bg-amber-600 hover:bg-amber-700' : ''}
            >
              {state === 'ALL' ? 'Todas' : getStateLabel(state)}
            </Button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredBookings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No hay reservas con el filtro seleccionado
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className={`p-6 cursor-pointer transition-colors ${
                selectedBooking?.id === booking.id
                  ? 'bg-amber-50 border-l-4 border-amber-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onBookingSelect(booking)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {booking.client.firstName} {booking.client.lastName}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(booking.date).toLocaleDateString('es-ES')}
                  </div>
                  {booking.venue && (
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {booking.venue}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStateColor(booking.state)}`}>
                    {getStateLabel(booking.state)}
                  </span>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Euro className="h-4 w-4 mr-1" />
                    {(booking.priceCents / 100).toFixed(0)}€
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span className="mr-4">{booking.pack}</span>
                <Phone className="h-4 w-4 mr-1" />
                <span className="mr-4">{booking.client.phone || 'Sin teléfono'}</span>
                <Mail className="h-4 w-4 mr-1" />
                <span className="truncate">{booking.client.email}</span>
              </div>

              {booking.contract && (
                <div className="mt-2 text-xs text-green-600">
                  ✓ Contrato generado
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
