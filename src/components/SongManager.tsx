'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { Plus, Edit, Trash2, Music, Star, Upload, Play, Pause, Save, X } from 'lucide-react'

interface Song {
  id: string
  title: string
  composer: string
  genre: string
  durationSec: number
  isFeatured: boolean
  createdAt: string
  audioUrl?: string
  s3Key?: string
}

export default function SongManager() {
  const { t } = useTranslation()
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSong, setEditingSong] = useState<Song | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [uploadMessage, setUploadMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newSong, setNewSong] = useState({
    title: '',
    composer: '',
    genre: '',
    isFeatured: false
  })

  useEffect(() => {
    fetchSongs()
  }, [])

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs')
      if (response.ok) {
        const data = await response.json()
        setSongs(data || [])
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta canción?')) return

    try {
      const response = await fetch(`/api/admin/songs/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSongs(prev => prev.filter(song => song.id !== id))
      }
    } catch (error) {
      console.error('Error deleting song:', error)
    }
  }

  const handleCreateSong = async () => {
    try {
      const response = await fetch('/api/admin/songs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSong)
      })

      if (response.ok) {
        const song = await response.json()
        setSongs(prev => [...prev, song])
        setNewSong({ title: '', composer: '', genre: '', isFeatured: false })
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating song:', error)
    }
  }

  const handleUpdateSong = async (song: Song) => {
    try {
      const response = await fetch(`/api/admin/songs/${song.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: song.title,
          composer: song.composer,
          genre: song.genre,
          isFeatured: song.isFeatured
        })
      })

      if (response.ok) {
        setSongs(prev => prev.map(s => s.id === song.id ? song : s))
        setEditingSong(null)
      }
    } catch (error) {
      console.error('Error updating song:', error)
    }
  }

  const handleAudioUpload = async (songId: string, file: File) => {
    setUploading(true)
    setUploadMessage(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('songId', songId)

      console.log('Subiendo archivo:', file.name, 'para canción:', songId)

      const response = await fetch('/api/admin/songs/upload-audio', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Respuesta del servidor:', result)
        
        setSongs(prev => prev.map(song => 
          song.id === songId ? { ...song, s3Key: result.url, durationSec: result.duration } : song
        ))
        
        setUploadMessage({
          type: 'success',
          text: `Audio subido correctamente. Duración: ${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}`
        })
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => setUploadMessage(null), 5000)
      } else {
        const errorData = await response.json()
        console.error('Error del servidor:', errorData)
        setUploadMessage({
          type: 'error',
          text: `Error al subir audio: ${errorData.error || 'Error desconocido'}`
        })
      }
    } catch (error) {
      console.error('Error uploading audio:', error)
      setUploadMessage({
        type: 'error',
        text: 'Error de conexión al subir el archivo'
      })
    } finally {
      setUploading(false)
    }
  }

  const handlePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id)
  }

  const handleToggleFeatured = async (id: string, isFeatured: boolean) => {
    try {
      const response = await fetch(`/api/admin/songs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isFeatured: !isFeatured })
      })

      if (response.ok) {
        setSongs(prev => prev.map(song => 
          song.id === id ? { ...song, isFeatured: !isFeatured } : song
        ))
      }
    } catch (error) {
      console.error('Error updating song:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando canciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Gestión de Canciones</h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            <Plus className="h-4 w-4 mr-2 inline" />
            Nueva canción
          </button>
        </div>
        
        {/* Notificaciones de subida */}
        {uploadMessage && (
          <div className={`mt-4 p-3 rounded-md ${
            uploadMessage.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                uploadMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {uploadMessage.text}
            </div>
          </div>
        )}
      </div>

      {/* Form to create new song */}
      {showForm && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-md font-semibold text-gray-900 mb-4">Añadir Nueva Canción</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input
                type="text"
                value={newSong.title}
                onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Título de la canción"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compositor</label>
              <input
                type="text"
                value={newSong.composer}
                onChange={(e) => setNewSong(prev => ({ ...prev, composer: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                placeholder="Nombre del compositor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select
                value={newSong.genre}
                onChange={(e) => setNewSong(prev => ({ ...prev, genre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent"
              >
                <option value="">Seleccionar género</option>
                <option value="Clásica">Clásica</option>
                <option value="Pop">Pop</option>
                <option value="Jazz">Jazz</option>
                <option value="Folk">Folk</option>
                <option value="Rock">Rock</option>
                <option value="Latina">Latina</option>
              </select>
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newSong.isFeatured}
                  onChange={(e) => setNewSong(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Destacada</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-2 inline" />
              Cancelar
            </button>
            <button
              onClick={handleCreateSong}
              className="bg-gold-600 hover:bg-gold-700 text-white px-4 py-2 rounded-md"
            >
              <Save className="h-4 w-4 mr-2 inline" />
              Guardar
            </button>
          </div>
        </div>
      )}

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
                        <div className="flex items-center">
                          <button
                            onClick={() => handlePlay(song.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 mr-2"
                          >
                            {playingId === song.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </button>
                          {editingSong?.id === song.id ? (
                            <input
                              type="text"
                              value={song.title}
                              onChange={(e) => setEditingSong(prev => prev ? { ...prev, title: e.target.value } : null)}
                              className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">
                              {song.title}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingSong?.id === song.id ? (
                          <input
                            type="text"
                            value={song.composer}
                            onChange={(e) => setEditingSong(prev => prev ? { ...prev, composer: e.target.value } : null)}
                            className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{song.composer}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingSong?.id === song.id ? (
                          <select
                            value={song.genre}
                            onChange={(e) => setEditingSong(prev => prev ? { ...prev, genre: e.target.value } : null)}
                            className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="Clásica">Clásica</option>
                            <option value="Pop">Pop</option>
                            <option value="Jazz">Jazz</option>
                            <option value="Folk">Folk</option>
                            <option value="Rock">Rock</option>
                            <option value="Latina">Latina</option>
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{song.genre}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(song.durationSec)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleFeatured(song.id, song.isFeatured)}
                          className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                            song.isFeatured
                              ? 'bg-gold-100 text-gold-800 hover:bg-gold-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          <Star className={`h-3 w-3 mr-1 ${song.isFeatured ? 'fill-current' : ''}`} />
                          {song.isFeatured ? 'Sí' : 'No'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {editingSong?.id === song.id ? (
                            <>
                              <button
                                onClick={() => handleUpdateSong(song)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditingSong(null)}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingSong(song)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept=".mp3,audio/mpeg"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    // Validar que es un archivo MP3
                                    if (!file.type.includes('audio/mpeg') && !file.name.toLowerCase().endsWith('.mp3')) {
                                      alert('Solo se permiten archivos MP3')
                                      return
                                    }
                                    handleAudioUpload(song.id, file)
                                  }
                                }}
                                className="hidden"
                              />
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-600 hover:text-blue-700"
                                title="Subir audio"
                              >
                                <Upload className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(song.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
        </table>
      </div>

      {songs.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay canciones
          </h3>
          <p className="text-gray-500 mb-4">
            Añade canciones para crear tu catálogo musical
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Añadir primera canción
          </Button>
        </div>
      )}
    </div>
  )
}
