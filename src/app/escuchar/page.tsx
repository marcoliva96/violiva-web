'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AudioPlayer } from '@/components/AudioPlayer'
import { SongCard } from '@/components/SongCard'
import { Search, Settings } from 'lucide-react'

interface Song {
  id: string
  title: string
  composer?: string
  genre?: string
  durationSec?: number
  isFeatured: boolean
}

export default function EscucharPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchSongs()
  }, [])

  useEffect(() => {
    filterSongs()
  }, [songs, searchQuery, selectedGenre, showFeaturedOnly])

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs')
      if (response.ok) {
        const data = await response.json()
        setSongs(Array.isArray(data) ? data : [])
      } else {
        // Fallback data si la API no funciona
        setSongs([
          { id: '1', title: 'Canon in D', composer: 'Johann Pachelbel', genre: 'Clásica', durationSec: 300, isFeatured: true },
          { id: '2', title: 'Ave Maria', composer: 'Franz Schubert', genre: 'Clásica', durationSec: 240, isFeatured: true },
          { id: '3', title: 'All of Me', composer: 'John Legend', genre: 'Pop', durationSec: 270, isFeatured: true },
          { id: '4', title: 'Perfect', composer: 'Ed Sheeran', genre: 'Pop', durationSec: 260, isFeatured: true },
          { id: '5', title: 'Thinking Out Loud', composer: 'Ed Sheeran', genre: 'Pop', durationSec: 280, isFeatured: true },
          { id: '6', title: 'At Last', composer: 'Etta James', genre: 'Jazz', durationSec: 190, isFeatured: false },
          { id: '7', title: 'La Vie En Rose', composer: 'Édith Piaf', genre: 'Jazz', durationSec: 200, isFeatured: false },
          { id: '8', title: 'Fly Me to the Moon', composer: 'Frank Sinatra', genre: 'Jazz', durationSec: 150, isFeatured: false },
          { id: '9', title: 'Hallelujah', composer: 'Leonard Cohen', genre: 'Folk', durationSec: 300, isFeatured: false },
          { id: '10', title: 'Make You Feel My Love', composer: 'Bob Dylan', genre: 'Folk', durationSec: 240, isFeatured: false },
        ])
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
      // Fallback data si hay error
      setSongs([
        { id: '1', title: 'Canon in D', composer: 'Johann Pachelbel', genre: 'Clásica', durationSec: 300, isFeatured: true },
        { id: '2', title: 'Ave Maria', composer: 'Franz Schubert', genre: 'Clásica', durationSec: 240, isFeatured: true },
        { id: '3', title: 'All of Me', composer: 'John Legend', genre: 'Pop', durationSec: 270, isFeatured: true },
        { id: '4', title: 'Perfect', composer: 'Ed Sheeran', genre: 'Pop', durationSec: 260, isFeatured: true },
        { id: '5', title: 'Thinking Out Loud', composer: 'Ed Sheeran', genre: 'Pop', durationSec: 280, isFeatured: true },
        { id: '6', title: 'At Last', composer: 'Etta James', genre: 'Jazz', durationSec: 190, isFeatured: false },
        { id: '7', title: 'La Vie En Rose', composer: 'Édith Piaf', genre: 'Jazz', durationSec: 200, isFeatured: false },
        { id: '8', title: 'Fly Me to the Moon', composer: 'Frank Sinatra', genre: 'Jazz', durationSec: 150, isFeatured: false },
        { id: '9', title: 'Hallelujah', composer: 'Leonard Cohen', genre: 'Folk', durationSec: 300, isFeatured: false },
        { id: '10', title: 'Make You Feel My Love', composer: 'Bob Dylan', genre: 'Folk', durationSec: 240, isFeatured: false },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filterSongs = () => {
    let filtered = songs || []

    if (searchQuery) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.composer?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedGenre) {
      filtered = filtered.filter(song => song.genre === selectedGenre)
    }

    if (showFeaturedOnly) {
      filtered = filtered.filter(song => song.isFeatured)
    }

    setFilteredSongs(filtered)
  }

  const handlePreview = async (song: Song) => {
    try {
      const response = await fetch(`/api/songs/${song.id}/preview`)
      const data = await response.json()
      
      if (data.signedUrl) {
        setCurrentSong(song)
        setPreviewUrl(data.signedUrl)
      }
    } catch (error) {
      console.error('Error getting preview URL:', error)
    }
  }

  const genres = Array.from(new Set((songs || []).map(song => song.genre).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando canciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            Escucha nuestro repertorio
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Descubre las canciones que pueden hacer de tu boda un momento único
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por título o compositor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Todos los géneros</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>

            <Button
              variant={showFeaturedOnly ? "default" : "outline"}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Destacadas
            </Button>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      {currentSong && previewUrl && (
        <div className="sticky top-0 z-50 bg-white shadow-lg border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <AudioPlayer
              song={currentSong}
              url={previewUrl}
              onClose={() => {
                setCurrentSong(null)
                setPreviewUrl(null)
              }}
            />
          </div>
        </div>
      )}

      {/* Songs Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron canciones con los filtros seleccionados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onPreview={() => handlePreview(song)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
