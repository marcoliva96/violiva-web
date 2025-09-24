'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Music, Calendar, Star, CheckCircle, Users, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import ReviewsCarousel from '@/components/ReviewsCarousel'
import ReviewForm from '@/components/ReviewForm'
import { useTranslation } from '@/hooks/useTranslation'

interface Review {
  id: string
  clientName: string
  rating: number
  comment: string
  weddingDate?: string
}

export default function HomePage() {
  const { t } = useTranslation()
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
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4">
                  {t('home.title').split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < t('home.title').split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-4">
                  {t('home.subtitle')}
                </p>
                <p className="text-sm text-gray-500 italic max-w-3xl mx-auto">
                  {t('home.systemDescription')}
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
              
              {/* Ceremonia */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('home.proposal.ceremony.title')}</h3>
                <p className="text-lg text-gray-600 mb-4">
                  {t('home.proposal.ceremony.description')}
                </p>
              </div>

              {/* Cóctel */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('home.proposal.cocktail.title')}</h3>
                <p className="text-lg text-gray-600 mb-4">
                  {t('home.proposal.cocktail.description')}
                </p>
              </div>

              {/* Otros servicios */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('home.proposal.otherServices.title')}</h3>
                <p className="text-lg text-gray-600 mb-4">
                  {t('home.proposal.otherServices.description')}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Music className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
                  <p className="text-gray-600">{t('home.stats.weddings')}</p>
                </div>

                <div className="text-center">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">10+</h3>
                  <p className="text-gray-600">{t('home.stats.experience')}</p>
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
              {t('home.experiences.title')}
            </h2>
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
              {t('home.advantages.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Music className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('home.advantages.repertoire.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('home.advantages.repertoire.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t('home.advantages.repertoire.features.pop')}</li>
                <li>• {t('home.advantages.repertoire.features.disco')}</li>
                <li>• {t('home.advantages.repertoire.features.movies')}</li>
                <li>• {t('home.advantages.repertoire.features.legends')}</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('home.advantages.quality.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('home.advantages.quality.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t('home.advantages.quality.features.equipment')}</li>
                <li>• {t('home.advantages.quality.features.bases')}</li>
                <li>• {t('home.advantages.quality.features.experience')}</li>
                <li>• {t('home.advantages.quality.features.noSheets')}</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('home.advantages.experience.title')}</h3>
              <p className="text-gray-600 mb-4">
                {t('home.advantages.experience.description')}
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t('home.advantages.experience.features.years')}</li>
                <li>• {t('home.advantages.experience.features.formation')}</li>
                <li>• {t('home.advantages.experience.features.production')}</li>
                <li>• {t('home.advantages.experience.features.renewal')}</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-8">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6 text-center">
              {t('home.advantages.elegant.title')}
            </h3>
            <div className="max-w-2xl mx-auto">
              <ul className="space-y-4 text-lg text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">•</span>
                  <span><strong>{t('home.advantages.experience.features.renewal')}:</strong> {t('home.advantages.experience.features.renewal')}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-bold mr-3">•</span>
                  <span><strong>{t('home.advantages.comfort.title')}:</strong> {t('home.advantages.comfort.description')}</span>
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
              {t('home.packs.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.packs.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Ceremonia */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('home.packs.ceremony.name')}</h3>
              <p className="text-gray-600 mb-4">{t('home.packs.ceremony.description')}</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">{t('home.packs.ceremony.price')}</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.ceremony.features[0]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.ceremony.features[1]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.ceremony.features[2]')}</span>
                </li>
              </ul>
            </div>

            {/* Aperitivo 1h */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('home.packs.cocktail1h.name')}</h3>
              <p className="text-gray-600 mb-4">{t('home.packs.cocktail1h.description')}</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">{t('home.packs.cocktail1h.price')}</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.cocktail1h.features[0]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.cocktail1h.features[1]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.cocktail1h.features[2]')}</span>
                </li>
              </ul>
            </div>

            {/* Aperitivo 1.5h */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">{t('home.packs.cocktail1_5h.name')}</h3>
              <p className="text-gray-600 mb-4">{t('home.packs.cocktail1_5h.description')}</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">{t('home.packs.cocktail1_5h.price')}</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.cocktail1_5h.features[0]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.cocktail1_5h.features[1]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.cocktail1_5h.features[2]')}</span>
                </li>
              </ul>
            </div>

            {/* Ceremonia + Aperitivo 1h */}
            <div className="bg-white rounded-lg shadow-md p-8 border-2 border-amber-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  {t('home.packs.cocktail1_5h.features[3]')}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('home.packs.ceremonyCocktail1h.name')}</h3>
              <p className="text-gray-600 mb-4">{t('home.packs.ceremonyCocktail1h.description')}</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">{t('home.packs.ceremonyCocktail1h.price')}</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.ceremonyCocktail1h.features[0]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.ceremonyCocktail1h.features[1]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.ceremonyCocktail1h.features[2]')}</span>
                </li>
              </ul>
            </div>

            {/* Ceremonia + Aperitivo 1.5h */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('home.packs.ceremonyCocktail1_5h.name')}</h3>
              <p className="text-gray-600 mb-4">{t('home.packs.ceremonyCocktail1_5h.description')}</p>
              <div className="text-4xl font-bold text-amber-600 mb-6">{t('home.packs.ceremonyCocktail1_5h.price')}</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.ceremonyCocktail1_5h.features[0]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.ceremonyCocktail1_5h.features[1]')}</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>{t('home.packs.ceremonyCocktail1_5h.features[2]')}</span>
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
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('home.cta.subtitle')}
          </p>
          <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/configura">
              {t('home.cta.button')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}