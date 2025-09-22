'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  DollarSign,
  Music,
  Star
} from 'lucide-react'

interface AnalyticsData {
  totalBookings: number
  totalRevenue: number
  averageBookingValue: number
  bookingsByMonth: Array<{ month: string; count: number; revenue: number }>
  popularPacks: Array<{ pack: string; count: number }>
  popularSongs: Array<{ title: string; count: number }>
  clientGrowth: Array<{ month: string; newClients: number }>
}

export default function AnalyticsDashboard() {
  const { t } = useTranslation()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('6months')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-gray-500">
            Las estadísticas aparecerán cuando tengas más datos
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Estadísticas</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
          >
            <option value="1month">Último mes</option>
            <option value="3months">Últimos 3 meses</option>
            <option value="6months">Últimos 6 meses</option>
            <option value="1year">Último año</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-gold-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Valor Promedio</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageBookingValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Crecimiento</p>
              <p className="text-2xl font-bold text-gray-900">
                +{analytics.clientGrowth[analytics.clientGrowth.length - 1]?.newClients || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Packs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Packs Más Populares</h3>
          <div className="space-y-3">
            {analytics.popularPacks.map((pack, index) => (
              <div key={pack.pack} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-gold-800">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{pack.pack}</span>
                </div>
                <span className="text-sm text-gray-600">{pack.count} solicitudes</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Songs */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Canciones Más Populares</h3>
          <div className="space-y-3">
            {analytics.popularSongs.slice(0, 5).map((song, index) => (
              <div key={song.title} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gold-100 rounded-full flex items-center justify-center mr-3">
                    <Music className="h-4 w-4 text-gold-800" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">{song.title}</span>
                </div>
                <span className="text-sm text-gray-600">{song.count} veces</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Mes</h3>
        <div className="space-y-4">
          {analytics.bookingsByMonth.map((month) => (
            <div key={month.month} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{month.month}</span>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{month.count} solicitudes</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(month.revenue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
