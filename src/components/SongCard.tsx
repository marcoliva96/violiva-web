'use client'

import { Button } from '@/components/ui/button'
import { Play, Clock, Star } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

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
  const { t } = useTranslation()
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
              {song.title}
            </h3>
            {song.composer && (
              <p className="text-gray-600 text-xs mb-2 truncate">
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
            <Star className="h-4 w-4 text-amber-500 fill-current flex-shrink-0 ml-2" />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-500 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(song.durationSec)}
          </div>
          
          <Button
            onClick={onPreview}
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2 py-1"
          >
            <Play className="h-3 w-3 mr-1" />
            {t('listen.listen')}
          </Button>
        </div>
      </div>
    </div>
  )
}
