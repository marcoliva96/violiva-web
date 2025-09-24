'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Euro, User, Phone, Mail, Music, FileText, Download, Send } from 'lucide-react'

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
    pdfUrl: string
    generatedAt: string
    sentAt?: string
    signedAt?: string
  }
}

interface BookingDetailsProps {
  booking: Booking
  onBookingUpdate: (booking: Booking) => void
}

export function BookingDetails({ booking, onBookingUpdate }: BookingDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState('')

  const handleStateChange = async (newState: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ state: newState }),
      })

      if (response.ok) {
        const updatedBooking = await response.json()
        onBookingUpdate(updatedBooking)
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateContract = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}/generate-contract`, {
        method: 'POST',
      })

      if (response.ok) {
        const result = await response.json()
        // Refresh booking data
        const bookingResponse = await fetch(`/api/admin/bookings/${booking.id}`)
        if (bookingResponse.ok) {
          const updatedBooking = await bookingResponse.json()
          onBookingUpdate(updatedBooking)
        }
      }
    } catch (error) {
      console.error('Error generating contract:', error)
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la reserva</h3>
        
        {/* Client Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-sm text-gray-600">
              {booking.client.firstName} {booking.client.lastName}
            </span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-sm text-gray-600">{booking.client.email}</span>
          </div>
          {booking.client.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">{booking.client.phone}</span>
            </div>
          )}
        </div>

        {/* Event Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-sm text-gray-600">
              {new Date(booking.date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          {booking.venue && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm text-gray-600">{booking.venue}</span>
            </div>
          )}
          <div className="flex items-center">
            <Euro className="h-4 w-4 text-gray-400 mr-3" />
            <span className="text-sm text-gray-600">
              {(booking.priceCents / 100).toFixed(0)}€ - {booking.pack}
            </span>
          </div>
        </div>

        {/* State */}
        <div className="mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStateColor(booking.state)}`}>
            {getStateLabel(booking.state)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-4">
        <h4 className="font-medium text-gray-900">Acciones</h4>
        
        {/* State Changes */}
        <div className="space-y-2">
          {booking.state === 'CONTACTED' && (
            <Button
              onClick={() => handleStateChange('CONFIRMED')}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Confirmar
            </Button>
          )}
          
          {booking.state === 'CONFIRMED' && (
            <Button
              onClick={() => handleStateChange('PAID')}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Marcar como Pagada
            </Button>
          )}
          
          {booking.state === 'PAID' && (
            <Button
              onClick={() => handleStateChange('COMPLETED')}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Marcar como Completada
            </Button>
          )}
        </div>

        {/* Contract Actions */}
        <div className="border-t pt-4">
          {!booking.contract ? (
            <Button
              onClick={handleGenerateContract}
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generar Contrato
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-green-600 mb-2">
                ✓ Contrato generado
              </div>
              <Button
                onClick={() => window.open(booking.contract?.pdfUrl, '_blank')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
              <Button
                variant="outline"
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar por Email
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Song Selections */}
      {booking.selections.length > 0 && (
        <div className="p-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Music className="h-4 w-4 mr-2" />
            Canciones seleccionadas
          </h4>
          <div className="space-y-2">
            {booking.selections.map((selection, index) => (
              <div key={index} className="text-sm text-gray-600">
                {selection.song ? (
                  <div>
                    <span className="font-medium">{selection.song.title}</span>
                    {selection.song.composer && (
                      <span className="text-gray-500"> - {selection.song.composer}</span>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="font-medium">{selection.customTitle}</span>
                    <span className="text-gray-500"> (personalizada)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
