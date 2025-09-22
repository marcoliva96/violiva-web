import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Camera, Video } from 'lucide-react'
import Link from 'next/link'

export default function GaleriaPage() {
  const photos = [
    { id: 1, title: 'Ceremonia en Masía El Olivar', type: 'photo' },
    { id: 2, title: 'Cóctel en Hotel Palace', type: 'photo' },
    { id: 3, title: 'Boda en la playa', type: 'photo' },
    { id: 4, title: 'Ceremonia íntima', type: 'photo' },
    { id: 5, title: 'Boda en el campo', type: 'photo' },
    { id: 6, title: 'Ceremonia en iglesia', type: 'photo' },
  ]

  const videos = [
    { id: 1, title: 'Momento de la entrada', type: 'video' },
    { id: 2, title: 'Canon in D - Ceremonia', type: 'video' },
    { id: 3, title: 'Cóctel con música en vivo', type: 'video' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                Galería
              </h1>
              <p className="text-gray-600">
                Momentos únicos de bodas anteriores
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photos Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center">
            <Camera className="h-6 w-6 mr-3 text-amber-600" />
            Fotos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-12 bg-gray-200 h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm">{photo.title}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{photo.title}</h3>
                  <p className="text-sm text-gray-600">Boda anterior</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center">
            <Video className="h-6 w-6 mr-3 text-amber-600" />
            Videos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 h-48 flex items-center justify-center relative">
                  <div className="text-center text-gray-500">
                    <div className="bg-black bg-opacity-50 rounded-full p-4 mb-2">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-sm">{video.title}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600">Momento especial</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
            ¿Te gusta lo que ves?
          </h2>
          <p className="text-gray-600 mb-6">
            Cada boda es única. Configura la tuya y crea momentos igual de especiales.
          </p>
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/configura">
              Configurar mi boda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
