'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Star, MessageSquare } from 'lucide-react'

interface ReviewFormData {
  member1: string
  member2: string
  rating: number
  comment: string
  weddingMonth: string
  weddingYear: string
}

export default function ReviewForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<ReviewFormData>({
    member1: '',
    member2: '',
    rating: 5,
    comment: '',
    weddingMonth: '',
    weddingYear: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('¡Gracias! Tu review ha sido enviada y será revisada antes de publicarse.')
        setFormData({
          member1: '',
          member2: '',
          rating: 5,
          comment: '',
          weddingMonth: '',
          weddingYear: ''
        })
        setIsOpen(false)
      } else {
        setMessage(result.error || 'Error al enviar la review')
      }
    } catch (error) {
      setMessage('Error al enviar la review. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }


  if (!isOpen) {
    return (
      <div className="text-center">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Dejar una review
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Comparte tu experiencia
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miembro 1 de la pareja
              </label>
              <input
                type="text"
                value={formData.member1}
                onChange={(e) => setFormData(prev => ({ ...prev, member1: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Miembro 2 de la pareja
              </label>
              <input
                type="text"
                value={formData.member2}
                onChange={(e) => setFormData(prev => ({ ...prev, member2: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Puntuación (0-5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comentario
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={3}
              placeholder="Cuéntanos sobre tu experiencia..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mes de tu boda (opcional)
              </label>
              <select
                value={formData.weddingMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, weddingMonth: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Selecciona un mes</option>
                <option value="enero">Enero</option>
                <option value="febrero">Febrero</option>
                <option value="marzo">Marzo</option>
                <option value="abril">Abril</option>
                <option value="mayo">Mayo</option>
                <option value="junio">Junio</option>
                <option value="julio">Julio</option>
                <option value="agosto">Agosto</option>
                <option value="septiembre">Septiembre</option>
                <option value="octubre">Octubre</option>
                <option value="noviembre">Noviembre</option>
                <option value="diciembre">Diciembre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año de tu boda (opcional)
              </label>
              <input
                type="number"
                min="2020"
                max="2030"
                value={formData.weddingYear}
                onChange={(e) => setFormData(prev => ({ ...prev, weddingYear: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="2024"
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm ${message.includes('Gracias') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
