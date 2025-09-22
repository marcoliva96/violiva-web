'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface Review {
  id: string
  clientName: string
  rating: number
  comment: string
  weddingDate?: string
}

interface ReviewsCarouselProps {
  reviews: Review[]
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (reviews.length <= 2) return

    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % (reviews.length - 1))
        setIsVisible(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [reviews.length])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long' 
    })
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center text-gray-500">
        No hay reviews disponibles
      </div>
    )
  }

  if (reviews.length === 1) {
    const review = reviews[0]
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <div className="flex">{renderStars(review.rating)}</div>
          <span className="ml-2 text-sm text-gray-600">{review.clientName}</span>
        </div>
        <p className="text-gray-700 italic">"{review.comment}"</p>
        {review.weddingDate && (
          <p className="text-sm text-gray-500 mt-2">{formatDate(review.weddingDate)}</p>
        )}
      </div>
    )
  }

  // Mostrar 2 reviews simultáneamente
  const visibleReviews = [
    reviews[currentIndex],
    reviews[(currentIndex + 1) % reviews.length]
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {visibleReviews.map((review, index) => (
        <div
          key={`${review.id}-${currentIndex}-${index}`}
          className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 ${
            isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
        >
          <div className="flex items-center mb-4">
            <div className="flex">{renderStars(review.rating)}</div>
            <span className="ml-2 text-sm text-gray-600">{review.clientName}</span>
          </div>
          <p className="text-gray-700 italic">"{review.comment}"</p>
          {review.weddingDate && (
            <p className="text-sm text-gray-500 mt-2">{formatDate(review.weddingDate)}</p>
          )}
        </div>
      ))}
    </div>
  )
}
