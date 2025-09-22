'use client'

import { Button } from '@/components/ui/button'
import { Play, Clock, Star } from 'lucide-react'

interface SongCardProps {
  song: {
    id: string
    title: string
    composer?: string
    genre?: string
    durationSec?: number
    isFeatured: boolean
  }
  onPreview: () => void
}

export function SongCard({ song, onPreview }: SongCardProps) {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
              {song.title}
            </h3>
            {song.composer && (
              <p className="text-gray-600 text-sm mb-2 truncate">
                {song.composer}
              </p>
            )}
            {song.genre && (
              <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                {song.genre}
              </span>
            )}
          </div>
          {song.isFeatured && (
            <Star className="h-5 w-5 text-amber-500 fill-current flex-shrink-0 ml-2" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {formatDuration(song.durationSec)}
          </div>
          
          <Button
            onClick={onPreview}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Play className="h-4 w-4 mr-1" />
            Escuchar
          </Button>
        </div>
      </div>
    </div>
  )
}
