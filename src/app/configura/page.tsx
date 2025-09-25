'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfiguratorWizard } from '@/components/ConfiguratorWizard'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

export default function ConfiguraPage() {
  const { t } = useTranslation()
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<Record<string, unknown> | null>(null)

  const handleStepComplete = (stepData: Record<string, unknown>) => {
    setBookingData(prev => ({ ...(prev || {}), ...stepData }))
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    // Lógica inteligente de navegación hacia atrás basada en el pack
    const pack = bookingData?.pack as string
    
    if (currentStep === 5) { // Fecha
      if (pack === 'COCTEL') {
        setCurrentStep(3) // Ir a Cóctel
      } else if (pack === 'CEREMONIA') {
        setCurrentStep(2) // Ir a Momentos de ceremonia
      } else if (pack === 'CEREMONIA_APERITIVO_1H' || pack === 'CEREMONIA_APERITIVO_1_5H') {
        setCurrentStep(4) // Ir a Cóctel
      } else {
        setCurrentStep(4) // Por defecto, ir a Cóctel
      }
    } else if (currentStep === 4 && pack === 'COCTEL') { // Cóctel para pack COCTEL
      setCurrentStep(3) // Ir a Canciones
    } else {
      setCurrentStep(prev => Math.max(1, prev - 1))
    }
  }

  const handleNextStep = (step: number) => {
    setCurrentStep(step)
  }

  const handleSubmit = async (finalData: Record<string, unknown>) => {
    try {
      // Validate email before sending
      const client = finalData.client as any
      if (!client?.email || client.email.trim() === '') {
        alert('Por favor, ingresa un email válido')
        return
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(client.email)) {
        alert('Por favor, ingresa un email con formato válido (ejemplo@dominio.com)')
        return
      }
      
      const response = await fetch('/api/configure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      })

      if (response.ok) {
        const result = await response.json()
        setBookingData(result)
        setCurrentStep(7) // Success step
      } else {
        const error = await response.json()
        console.error('Error creating booking:', error)
        alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.')
      }
    } catch (error) {
      console.error('Error submitting booking:', error)
      alert('Error al enviar la solicitud. Por favor, inténtalo de nuevo.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">
                {t('configure.title')}
              </h1>
              <p className="text-gray-600">
                {t('configure.subtitle')}
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[
              { number: 1, name: 'Pack' },
              { number: 2, name: 'Ceremonia' },
              { number: 3, name: 'Canciones' },
              { number: 4, name: 'Cóctel' },
              { number: 5, name: 'Fecha' },
              { number: 6, name: 'Datos' },
              { number: 7, name: 'Resumen' }
            ].map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.number <= currentStep
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.number < currentStep ? '✓' : step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.number <= currentStep
                    ? 'text-orange-600'
                    : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < 6 && (
                  <div
                    className={`w-12 h-1 mx-2 ${
                      step.number < currentStep ? 'bg-orange-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <ConfiguratorWizard
          currentStep={currentStep}
          onStepComplete={handleStepComplete}
          onBack={handleBack}
          onSubmit={handleSubmit}
          onNextStep={handleNextStep}
          bookingData={bookingData}
        />
      </div>
    </div>
  )
}
