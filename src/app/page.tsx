'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Music, Calendar, Star, CheckCircle, Users, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import ReviewsCarousel from '@/components/ReviewsCarousel'
import ReviewForm from '@/components/ReviewForm'

interface Review {
  id: string
  clientName: string
  rating: number
  comment: string
  weddingDate?: string
}

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews')
        if (response.ok) {
          const data = await response.json()
          setReviews(data)
        }
      } catch (error) {
        console.error('Error fetching reviews:', error)
      }
    }

    fetchReviews()
  }, [])
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-rose-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                  Violiva music
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
                  Más de 10 años creando momentos únicos e irrepetibles en bodas. Mi experiencia y pasión por la música se unen para hacer de vuestro día especial algo inolvidable.
                </p>
                <p className="text-sm text-gray-500 italic max-w-3xl mx-auto">
                  Sistema "Configurar boda" exclusivo y pionero: creado por y para parejas, que os permite escuchar con total fidelidad cómo sonará vuestra boda con mis servicios. Una experiencia innovadora que os brinda la seguridad de saber exactamente cómo sonará cada momento especial.
                </p>
              </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6">
                Mi propuesta
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                La propuesta de Violiva se basa en ofreceros una sesión musical llena de éxitos para dar estilo y elegancia a vuestro aperitivo o cóctel. Dispone de equipo propio y bases instrumentales de calidad, por lo que la experiencia es envolvente, comparable a grupos con numerosos integrantes. Dará un toque especial a la velada sin robar protagonismo ni desviar toda la atención.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Repertorio variado, atemporal, al gusto de todos vuestros invitados.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                  <p className="text-gray-600">Bodas realizadas</p>
                </div>

                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">10+</h3>
                  <p className="text-gray-600">Años de experiencia</p>
                </div>
              </div>

            </div>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500">Imagen del violinista en acción</p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Experiencias (500+)
            </h2>
            <p className="text-xl text-gray-600">
              Lo que dicen las parejas sobre su experiencia
            </p>
          </div>


          {/* Reviews Section */}
          <div className="mb-8">
            <ReviewsCarousel reviews={reviews} />
          </div>

          {/* Review Form */}
          <div className="text-center">
            <ReviewForm />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Servicios que ofrece
            </h2>
            <p className="text-xl text-gray-600">
              Violiva plantea una alternativa distinta al resto de formaciones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Repertorio extenso</h3>
              <p className="text-gray-600 mb-4">
                Sin requerir de partituras, tiene preparado un repertorio de más de dos horas de música adaptada a violín.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Éxitos actuales del pop&rock</li>
                <li>• Canciones de discoteca</li>
                <li>• Bandas sonoras de películas</li>
                <li>• Grandes leyendas</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Calidad/Precio</h3>
              <p className="text-gray-600 mb-4">
                Ofrece una relación calidad/precio imbatible. El coste de contratación varía substancialmente en función del número de integrantes.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Equipo propio</li>
                <li>• Bases instrumentales de calidad</li>
                <li>• Experiencia envolvente</li>
                <li>• Sin necesidad de partituras</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Experiencia</h3>
              <p className="text-gray-600 mb-4">
                Lleva 10 años amenizando bodas, por lo cual supone una apuesta segura.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 10 años de experiencia</li>
                <li>• Formación en música moderna</li>
                <li>• Producción musical</li>
                <li>• Repertorio en constante renovación</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">
              Hará que vuestra boda sea elegante y memorable
            </h3>
            <div className="max-w-2xl mx-auto">
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">•</span>
                  <span><strong>Repertorio en constante renovación:</strong> Siempre actualizado con éxitos actuales, bandas sonoras y clásicos atemporales para sorprender a vuestros invitados.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">•</span>
                  <span><strong>Máxima comodidad en vuestro gran día:</strong> Sin partituras que distraigan, sin imprevistos y sin necesidad de gestionar nada in situ. Una actuación diseñada al detalle, con la excelencia y la elegancia que os permitirá vivir vuestra boda con total serenidad.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Compara los packs
            </h2>
            <p className="text-xl text-gray-600">
              Elige el pack que mejor se adapte a tu boda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Ceremonia */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ceremonia</h3>
              <p className="text-gray-600 mb-4">Música para la ceremonia</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">200€</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Música para la ceremonia</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Selección de momentos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Perfecto para ceremonias íntimas</span>
                </li>
              </ul>
            </div>

            {/* Aperitivo 1h */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Aperitivo (1h)</h3>
              <p className="text-gray-600 mb-4">Música para el aperitivo</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">200€</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>1 hora de música</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Múltiples estilos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Ambiente relajado</span>
                </li>
              </ul>
            </div>

            {/* Aperitivo 1.5h */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Aperitivo (1,5h)</h3>
              <p className="text-gray-600 mb-4">Música para el aperitivo extendido</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">250€</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>1,5 horas de música</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Múltiples estilos</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Ambiente relajado</span>
                </li>
              </ul>
            </div>

            {/* Ceremonia + Aperitivo 1h */}
            <div className="bg-white rounded-lg shadow-md p-8 border-2 border-amber-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Más popular
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ceremonia + Aperitivo (1h)</h3>
              <p className="text-gray-600 mb-4">Servicio completo</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">300€</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Ceremonia + Aperitivo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Servicio completo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Más popular</span>
                </li>
              </ul>
            </div>

            {/* Ceremonia + Aperitivo 1.5h */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ceremonia + Aperitivo (1,5h)</h3>
              <p className="text-gray-600 mb-4">Servicio completo extendido</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">340€</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Ceremonia + Aperitivo</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>1,5 horas de aperitivo</span>
          </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Servicio completo</span>
          </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
            ¿Lista para crear el momento perfecto?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Configura tu boda en menos de 5 minutos y recibe una propuesta personalizada.
          </p>
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/configura">
              Empezar configuración
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}