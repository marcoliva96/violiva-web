'use client'

import { useState, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Upload, Trash2, Image, Eye, Download } from 'lucide-react'

interface Photo {
  id: string
  name: string
  url: string
  size: number
  uploadedAt: string
  section: 'gallery' | 'hero' | 'about' | 'testimonials'
}

const PHOTO_SECTIONS = {
  gallery: 'Galería',
  hero: 'Imagen Principal',
  about: 'Sobre Mí',
  testimonials: 'Testimonios'
}

export default function PhotoManager() {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [selectedSection, setSelectedSection] = useState<keyof typeof PHOTO_SECTIONS>('gallery')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          alert('Solo se permiten archivos de imagen')
          continue
        }

        if (file.size > 50 * 1024 * 1024) {
          alert('El archivo es demasiado grande (máximo 50MB)')
          continue
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', file.name)
        formData.append('section', selectedSection)

        const response = await fetch('/api/admin/photos/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          setPhotos(prev => [...prev, result])
        }
      }
    } catch (error) {
      console.error('Error uploading photos:', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) return

    try {
      const response = await fetch(`/api/admin/photos/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPhotos(prev => prev.filter(photo => photo.id !== id))
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredPhotos = photos.filter(photo => photo.section === selectedSection)

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Gestión de Fotos</h2>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:bg-gray-400"
            >
              <Upload className="h-4 w-4 mr-2 inline" />
              {uploading ? 'Subiendo...' : 'Importar Fotos'}
            </button>
          </div>
        </div>

        {/* Section Selector */}
        <div className="flex space-x-1 mt-4">
          {Object.entries(PHOTO_SECTIONS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedSection(key as keyof typeof PHOTO_SECTIONS)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSection === key
                  ? 'bg-gold-100 text-gold-800'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Image className="h-4 w-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-md font-semibold text-gray-900 mb-2">
            {PHOTO_SECTIONS[selectedSection]}
          </h3>
          <p className="text-sm text-gray-600">
            {selectedSection === 'gallery' && 'Fotos para la galería de la web'}
            {selectedSection === 'hero' && 'Imagen principal de la página de inicio'}
            {selectedSection === 'about' && 'Fotos para la sección "Sobre mí"'}
            {selectedSection === 'testimonials' && 'Fotos de clientes para testimonios'}
          </p>
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay fotos en esta sección
            </h3>
            <p className="text-gray-500 mb-4">
              Sube fotos para esta sección de la web
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-md"
            >
              <Upload className="h-4 w-4 mr-2 inline" />
              Subir primera foto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-900 truncate mb-2">
                    {photo.name}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{formatFileSize(photo.size)}</span>
                    <span>{new Date(photo.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                      <Eye className="h-3 w-3 mr-1 inline" />
                      Ver
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm">
                      <Download className="h-3 w-3 mr-1 inline" />
                      Descargar
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
