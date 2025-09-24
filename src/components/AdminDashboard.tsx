'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  Users, 
  Music, 
  BarChart3, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Check,
  X,
  EyeOff,
  Filter
} from 'lucide-react'

interface Booking {
  id: string
  client: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    partnerName?: string
    weddingDate?: string
    status: string // Estado del cliente
  }
  date: string
  venue?: string
  ceremonyVenue?: string
  cocktailVenue?: string
  pack: string
  priceCents: number
  finalPrice?: number
  state: string // Estado del booking
  languagePreference?: string
  visible: boolean
  createdAt: string
  updatedAt: string
  selections: {
    id: string
    moment: string
    customTitle?: string
    customSource?: string
    song?: {
      id: string
      title: string
      composer: string
    }
  }[]
  contract?: {
    id: string
    generatedAt: string
    sentAt?: string
    signedAt?: string
  }
}

interface Song {
  id: string
  title: string
  composer: string
  genre: string
  durationSec: number
  isFeatured: boolean
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [filterState, setFilterState] = useState<string>('CONTACTED')
  const [showHidden, setShowHidden] = useState(false)

  useEffect(() => {
    fetchData()
  }, [filterState, showHidden])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch bookings with filters
      let url = '/api/admin/bookings'
      const params = new URLSearchParams()
      
      if (filterState !== 'ALL') {
        params.append('status', filterState)
      }
      
      if (showHidden) {
        params.append('includeHidden', 'true')
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const bookingsResponse = await fetch(url)
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData.bookings || [])
        console.log('Bookings loaded:', bookingsData.bookings?.length)
      } else {
        console.error('Error fetching bookings:', await bookingsResponse.text())
      }

      // Fetch songs
      const songsResponse = await fetch('/api/songs')
      if (songsResponse.ok) {
        const songsData = await songsResponse.json()
        setSongs(songsData || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'CONTACTED': return 'bg-yellow-100 text-yellow-800'
      case 'NEGOTIATING': return 'bg-orange-100 text-orange-800'
      case 'CONFIRMED': return 'bg-green-100 text-green-800'
      case 'PAID': return 'bg-blue-100 text-blue-800'
      case 'REALIZED': return 'bg-purple-100 text-purple-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'CONTACTED': return 'Contactado'
      case 'NEGOTIATING': return 'Negociando'
      case 'CONFIRMED': return 'Confirmado'
      case 'PAID': return 'Pagado'
      case 'REALIZED': return 'Realizado'
      case 'CANCELLED': return 'Cancelado'
      default: return state
    }
  }

  const formatPrice = (priceCents: number) => {
    return `${(priceCents / 100).toFixed(0)}€`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        fetchData()
        console.log('Booking updated successfully')
      } else {
        console.error('Error updating booking')
      }
    } catch (error) {
      console.error('Error updating booking:', error)
    }
  }

  const toggleVisibility = async (bookingId: string, visible: boolean) => {
    await updateBooking(bookingId, { visible })
  }

  const changeState = async (bookingId: string, newState: string) => {
    // Actualizar el estado del cliente asociado al booking
    const response = await fetch(`/api/admin/clients/${bookingId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newState })
    })

    if (response.ok) {
      fetchData()
      console.log('Client status updated successfully')
    } else {
      console.error('Error updating client status')
    }
  }

  const showBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowDetails(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="mt-1 text-sm text-gray-500">Gestiona solicitudes, clientes y contenido</p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant={showHidden ? "default" : "outline"}
                onClick={() => setShowHidden(!showHidden)}
                size="sm"
              >
                <EyeOff className="h-4 w-4 mr-2" />
                {showHidden ? 'Ocultar' : 'Mostrar'} ocultos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5 inline mr-2" />
              Registros ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('songs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'songs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Music className="h-5 w-5 inline mr-2" />
              Canciones ({songs.length})
            </button>
          </nav>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Registros</h2>
                <div className="flex space-x-4">
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    <option value="CONTACTED">Contactados</option>
                    <option value="NEGOTIATING">Negociando</option>
                    <option value="CONFIRMED">Confirmados</option>
                    <option value="PAID">Pagados</option>
                    <option value="REALIZED">Realizados</option>
                    <option value="CANCELLED">Cancelados</option>
                    <option value="ALL">Todos los estados</option>
                  </select>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo registro
                  </Button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pack
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visibilidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className={!booking.visible ? 'opacity-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.client.firstName} {booking.client.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{booking.client.email}</div>
                          {booking.client.phone && (
                            <div className="text-sm text-gray-500">{booking.client.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(booking.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.pack}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(booking.priceCents)}
                        {booking.finalPrice && booking.finalPrice !== booking.priceCents && (
                          <div className="text-xs text-gray-500">
                            Final: {formatPrice(booking.finalPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStateColor(booking.client.status)}`}>
                          {getStateLabel(booking.client.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleVisibility(booking.id, !booking.visible)}
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.visible 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.visible ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                          {booking.visible ? 'Visible' : 'Oculto'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => showBookingDetails(booking)}
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          {/* Estado: Contactado -> Negociando */}
                          {booking.client.status === 'CONTACTED' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => changeState(booking.id, 'NEGOTIATING')}
                              className="text-orange-600 hover:text-orange-700"
                              title="Iniciar negociación"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {/* Estado: Negociando -> Confirmado */}
                          {booking.client.status === 'NEGOTIATING' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => changeState(booking.id, 'CONFIRMED')}
                              className="text-green-600 hover:text-green-700"
                              title="Confirmar"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {/* Estado: Confirmado -> Pagado */}
                          {booking.client.status === 'CONFIRMED' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => changeState(booking.id, 'PAID')}
                              className="text-blue-600 hover:text-blue-700"
                              title="Marcar como pagado"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {/* Estado: Pagado -> Realizado */}
                          {booking.client.status === 'PAID' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => changeState(booking.id, 'REALIZED')}
                              className="text-purple-600 hover:text-purple-700"
                              title="Marcar como realizado"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {/* Cancelar en cualquier estado */}
                          {booking.client.status !== 'CANCELLED' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => changeState(booking.id, 'CANCELLED')}
                              className="text-red-600 hover:text-red-700"
                              title="Cancelar"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button variant="ghost" size="sm" title="Descargar">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Songs Tab */}
        {activeTab === 'songs' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Canciones</h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva canción
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compositor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Género
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duración
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destacada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {songs.map((song) => (
                    <tr key={song.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{song.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {song.composer || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {song.genre || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {song.durationSec ? `${Math.floor(song.durationSec / 60)}:${(song.durationSec % 60).toString().padStart(2, '0')}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          song.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {song.isFeatured ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Detalles del registro
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Información del cliente */}
                <div>
                  <h4 className="font-semibold text-gray-900">Cliente</h4>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Nombre:</strong> {selectedBooking.client.firstName} {selectedBooking.client.lastName}</p>
                    <p><strong>Email:</strong> {selectedBooking.client.email}</p>
                    {selectedBooking.client.phone && <p><strong>Teléfono:</strong> {selectedBooking.client.phone}</p>}
                    {selectedBooking.client.partnerName && <p><strong>Pareja:</strong> {selectedBooking.client.partnerName}</p>}
                    {selectedBooking.client.weddingDate && <p><strong>Fecha de boda:</strong> {formatDate(selectedBooking.client.weddingDate)}</p>}
                  </div>
                </div>

                {/* Información del booking */}
                <div>
                  <h4 className="font-semibold text-gray-900">Reserva</h4>
                  <div className="mt-2 text-sm text-gray-600">
                    <p><strong>Fecha:</strong> {formatDate(selectedBooking.date)}</p>
                    <p><strong>Pack:</strong> {selectedBooking.pack}</p>
                    <p><strong>Precio:</strong> {formatPrice(selectedBooking.priceCents)}</p>
                    {selectedBooking.finalPrice && <p><strong>Precio final:</strong> {formatPrice(selectedBooking.finalPrice)}</p>}
                    <p><strong>Estado:</strong> {getStateLabel(selectedBooking.state)}</p>
                    {selectedBooking.languagePreference && <p><strong>Idioma:</strong> {selectedBooking.languagePreference}</p>}
                  </div>
                </div>

                {/* Lugares */}
                {(selectedBooking.ceremonyVenue || selectedBooking.cocktailVenue) && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Lugares</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      {selectedBooking.ceremonyVenue && <p><strong>Ceremonia:</strong> {selectedBooking.ceremonyVenue}</p>}
                      {selectedBooking.cocktailVenue && <p><strong>Aperitivo:</strong> {selectedBooking.cocktailVenue}</p>}
                    </div>
                  </div>
                )}

                {/* Canciones seleccionadas */}
                {selectedBooking.selections && selectedBooking.selections.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Canciones seleccionadas</h4>
                    <div className="mt-2 space-y-2">
                      {selectedBooking.selections.map((selection, index) => (
                        <div key={index} className="text-sm text-gray-600 border-l-2 border-blue-200 pl-3">
                          <p><strong>Momento:</strong> {selection.moment}</p>
                          {selection.song ? (
                            <p><strong>Canción:</strong> {selection.song.title} - {selection.song.composer}</p>
                          ) : selection.customTitle ? (
                            <p><strong>Canción personalizada:</strong> {selection.customTitle}</p>
                          ) : (
                            <p><strong>Sin canción seleccionada</strong></p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contrato */}
                {selectedBooking.contract && (
                  <div>
                    <h4 className="font-semibold text-gray-900">Contrato</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      <p><strong>Generado:</strong> {formatDate(selectedBooking.contract.generatedAt)}</p>
                      {selectedBooking.contract.sentAt && <p><strong>Enviado:</strong> {formatDate(selectedBooking.contract.sentAt)}</p>}
                      {selectedBooking.contract.signedAt && <p><strong>Firmado:</strong> {formatDate(selectedBooking.contract.signedAt)}</p>}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    // Aquí podrías implementar la generación de contrato
                    console.log('Generar contrato para:', selectedBooking.id)
                  }}
                >
                  Generar contrato
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}