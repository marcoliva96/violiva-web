'use client'

import { useState, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Upload, Play, Pause, Trash2, Download, Music, Image, Video, File } from 'lucide-react'

interface MediaFile {
  id: string
  name: string
  url: string
  type: 'audio' | 'image' | 'video'
  size: number
  uploadedAt: string
  duration?: number
}

export default function MediaManager() {
  const { t } = useTranslation()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<'audio' | 'image' | 'video'>('audio')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    
    try {
      for (const file of Array.from(files)) {
        // Validate file type based on active tab
        const isValidType = 
          (activeTab === 'audio' && file.type.startsWith('audio/')) ||
          (activeTab === 'image' && file.type.startsWith('image/')) ||
          (activeTab === 'video' && file.type.startsWith('video/'))

        if (!isValidType) {
          alert(`Solo se permiten archivos de ${activeTab}`)
          continue
        }

        // Validate file size (max 100MB for video, 50MB for others)
        const maxSize = activeTab === 'video' ? 100 * 1024 * 1024 : 50 * 1024 * 1024
        if (file.size > maxSize) {
          alert(`El archivo es demasiado grande (máximo ${activeTab === 'video' ? '100MB' : '50MB'})`)
          continue
        }

        // Create FormData
        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', file.name)
        formData.append('type', activeTab)

        // Upload to server
        const response = await fetch('/api/admin/media/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          setMediaFiles(prev => [...prev, result])
        } else {
          console.error('Error uploading file:', file.name)
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handlePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este archivo?')) return

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMediaFiles(prev => prev.filter(file => file.id !== id))
      }
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'audio': return <Music className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      case 'video': return <Video className="h-4 w-4" />
      default: return <File className="h-4 w-4" />
    }
  }

  const filteredFiles = mediaFiles.filter(file => file.type === activeTab)

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Gestión de Archivos Multimedia</h2>
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept={
                activeTab === 'audio' ? 'audio/*' :
                activeTab === 'image' ? 'image/*' :
                'video/*'
              }
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
              {uploading ? 'Subiendo...' : `Subir ${activeTab === 'audio' ? 'audios' : activeTab === 'image' ? 'imágenes' : 'vídeos'}`}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          {[
            { id: 'audio', label: 'Audios', icon: Music },
            { id: 'image', label: 'Imágenes', icon: Image },
            { id: 'video', label: 'Vídeos', icon: Video }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gold-100 text-gold-800'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            {getFileIcon(activeTab)}
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay archivos de {activeTab === 'audio' ? 'audio' : activeTab === 'image' ? 'imágenes' : 'vídeo'}
              </h3>
              <p className="text-gray-500 mb-4">
                Sube archivos para gestionar tu biblioteca multimedia
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-md"
              >
                <Upload className="h-4 w-4 mr-2 inline" />
                Subir primer archivo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {file.type === 'audio' ? (
                      <button
                        onClick={() => handlePlay(file.id)}
                        className="p-2 text-gray-600 hover:text-gray-900"
                      >
                        {playingId === file.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <div className="p-2 text-gray-400">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </h4>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      {file.duration && (
                        <span>{formatDuration(file.duration)}</span>
                      )}
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
