'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Music, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

interface ConfiguratorWizardProps {
  currentStep: number
  onStepComplete: (data: Record<string, unknown>) => void
  onBack: () => void
  onSubmit: (data: Record<string, unknown>) => void
  onNextStep: (step: number) => void
  bookingData: Record<string, unknown> | null
}

export function ConfiguratorWizard({
  currentStep,
  onStepComplete,
  onBack,
  onSubmit,
  onNextStep,
  bookingData
}: ConfiguratorWizardProps) {
  const { t } = useTranslation()
  const [selectedPack, setSelectedPack] = useState<string>('')
  const [selectedSongs, setSelectedSongs] = useState<string[]>([])
  const [customSongs, setCustomSongs] = useState<Array<{title: string, source?: string}>>([])
  const [ceremonyMoments, setCeremonyMoments] = useState<string[]>([])
  const [ceremonySongs, setCeremonySongs] = useState<Record<string, string>>({})
  const [cocktailStyles, setCocktailStyles] = useState<string[]>([])
  const [cocktailComment, setCocktailComment] = useState('')
  const [clientData, setClientData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    partnerName: '',
    weddingDate: '',
    venue: '',
    languagePreference: 'castellano'
  })
  const [busyDates, setBusyDates] = useState<string[]>([])
  const [loadingDates, setLoadingDates] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [songs, setSongs] = useState<Array<{
    id: string
    title: string
    composer?: string
    genre?: string
    durationSec?: number
  }>>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [playingSong, setPlayingSong] = useState<string | null>(null)
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null)
  const [customSongTitle, setCustomSongTitle] = useState('')
  const [customSongUrl, setCustomSongUrl] = useState('')
  const [showCustomForm, setShowCustomForm] = useState<string | null>(null)
  const [duplicateSongWarning, setDuplicateSongWarning] = useState<string | null>(null)
  const [firstPersonName, setFirstPersonName] = useState('')
  const [secondPersonName, setSecondPersonName] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Scroll automático al cambiar de paso
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentStep])

  // Pre-llenado de nombres removido - el usuario debe introducir sus datos manualmente

  // Función de validación del formulario
  const validateForm = () => {
    const errors: Record<string, string> = {}
    
    if (!clientData.firstName.trim()) {
      errors.firstName = 'El nombre es obligatorio'
    }
    if (!clientData.lastName.trim()) {
      errors.lastName = 'El apellido es obligatorio'
    }
    if (!clientData.email.trim()) {
      errors.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(clientData.email)) {
      errors.email = 'El email no es válido'
    }
    if (!clientData.phone.trim()) {
      errors.phone = 'El teléfono es obligatorio'
    }
    if (!clientData.weddingDate) {
      errors.weddingDate = 'La fecha de la boda es obligatoria'
    }
    if (!clientData.venue.trim()) {
      errors.venue = 'El lugar es obligatorio'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Preseleccionar momentos obligatorios cuando se carga el componente
  useEffect(() => {
    if (currentStep === 2 && (selectedPack === 'CEREMONIA' || selectedPack === 'CEREMONIA_APERITIVO_1H' || selectedPack === 'CEREMONIA_APERITIVO_1_5H')) {
      const ceremonyMomentsOptions = [
        { id: 'primera_entrada', name: 'Primera entrada', required: true },
        { id: 'segunda_entrada', name: 'Segunda entrada', required: true },
        { id: 'comunion', name: 'Comunión', required: false },
        { id: 'pausas', name: 'Pausas', required: false },
        { id: 'anillos', name: 'Anillos', required: false },
        { id: 'parlamentos', name: 'Parlamentos', required: false },
        { id: 'salida', name: 'Salida', required: true },
      ]
      
      const requiredMoments = ceremonyMomentsOptions.filter(m => m.required)
      const requiredIds = requiredMoments.map(m => m.id)
      const missingRequired = requiredIds.filter(id => !ceremonyMoments.includes(id))
      
      if (missingRequired.length > 0) {
        setCeremonyMoments(prev => [...prev, ...missingRequired])
      }
    }
  }, [currentStep, selectedPack, ceremonyMoments])

  // Preseleccionar todos los estilos de cóctel cuando se accede a la pantalla
  useEffect(() => {
    if ((currentStep === 4 && selectedPack === 'COCTEL') || (currentStep === 4 && selectedPack === 'APERITIVO_1H') || (currentStep === 4 && selectedPack === 'APERITIVO_1_5H') || (currentStep === 4 && selectedPack === 'CEREMONIA_APERITIVO_1H') || (currentStep === 4 && selectedPack === 'CEREMONIA_APERITIVO_1_5H')) {
      const styleOptions = [
        { id: 'clasica', name: 'Clásica' },
        { id: 'jazz', name: 'Jazz' },
        { id: 'pop', name: 'Pop' },
        { id: 'folk', name: 'Folk' },
        { id: 'latin', name: 'Latina' },
        { id: 'rock', name: 'Rock' },
      ]
      
      if (cocktailStyles.length === 0) {
        setCocktailStyles(styleOptions.map(style => style.id))
      }
    }
  }, [currentStep, selectedPack, cocktailStyles.length])

  // Cargar fechas ocupadas cuando se accede al paso de fecha
  useEffect(() => {
    if (currentStep === 5) {
      const fetchBusyDates = async () => {
        setLoadingDates(true)
        try {
          // Simular fechas ocupadas para testing
          const today = new Date()
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          const dayAfterTomorrow = new Date(today)
          dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
          
          // Fechas ocupadas de ejemplo
          const mockBusyDates = [
            tomorrow.toISOString().split('T')[0],
            dayAfterTomorrow.toISOString().split('T')[0]
          ]
          
          setBusyDates(mockBusyDates)
        } catch (error) {
          console.error('Error fetching busy dates:', error)
          setBusyDates([])
        } finally {
          setLoadingDates(false)
        }
      }
      fetchBusyDates()
    }
  }, [currentStep, currentMonth, currentYear])

  const packs = [
    {
      id: 'CEREMONIA',
      name: 'Ceremonia',
      description: 'Música para la ceremonia',
      price: 200,
      service: 'ceremonia',
      features: ['Música para la ceremonia', 'Selección de momentos', 'Perfecto para ceremonias íntimas']
    },
    {
      id: 'APERITIVO_1H',
      name: 'Aperitivo (1h)',
      description: 'Música para el aperitivo',
      price: 200,
      service: 'aperitivo',
      features: ['1 hora de música', 'Múltiples estilos', 'Ambiente relajado']
    },
    {
      id: 'APERITIVO_1_5H',
      name: 'Aperitivo (1,5h)',
      description: 'Música para el aperitivo extendido',
      price: 250,
      service: 'aperitivo',
      features: ['1,5 horas de música', 'Múltiples estilos', 'Ambiente relajado']
    },
    {
      id: 'CEREMONIA_APERITIVO_1H',
      name: 'Ceremonia + Aperitivo (1h)',
      description: 'Servicio completo',
      price: 300,
      service: 'completo',
      features: ['Ceremonia + Aperitivo', 'Servicio completo', 'Más popular'],
      isPopular: true
    },
    {
      id: 'CEREMONIA_APERITIVO_1_5H',
      name: 'Ceremonia + Aperitivo (1,5h)',
      description: 'Servicio completo extendido',
      price: 340,
      service: 'completo',
      features: ['Ceremonia + Aperitivo', '1,5 horas de aperitivo', 'Servicio completo']
    }
  ]

  useEffect(() => {
    if (currentStep === 2) {
      fetchSongs()
    }
  }, [currentStep])

  const getSelectedPackData = () => {
    return packs.find(p => p.id === selectedPack)
  }

  const getNextStep = () => {
    const packData = getSelectedPackData()
    if (!packData) return 2

    if (packData.service === 'ceremonia') {
      return 2 // Momentos de ceremonia
    } else if (packData.service === 'coctel') {
      return 3 // Estilos de cóctel
    } else if (packData.service === 'completo') {
      return 2 // Momentos de ceremonia primero
    }
    return 2
  }

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/songs')
      if (response.ok) {
        const data = await response.json()
        setSongs(Array.isArray(data) ? data : [])
      } else {
        // Fallback data si la API no funciona
        setSongs([
          { id: '1', title: 'Canon in D', composer: 'Johann Pachelbel', genre: 'Clásica' },
          { id: '2', title: 'Ave Maria', composer: 'Franz Schubert', genre: 'Clásica' },
          { id: '3', title: 'All of Me', composer: 'John Legend', genre: 'Pop' },
          { id: '4', title: 'Perfect', composer: 'Ed Sheeran', genre: 'Pop' },
          { id: '5', title: 'Thinking Out Loud', composer: 'Ed Sheeran', genre: 'Pop' },
        ])
      }
    } catch (error) {
      console.error('Error fetching songs:', error)
      // Fallback data si hay error
      setSongs([
        { id: '1', title: 'Canon in D', composer: 'Johann Pachelbel', genre: 'Clásica' },
        { id: '2', title: 'Ave Maria', composer: 'Franz Schubert', genre: 'Clásica' },
        { id: '3', title: 'All of Me', composer: 'John Legend', genre: 'Pop' },
        { id: '4', title: 'Perfect', composer: 'Ed Sheeran', genre: 'Pop' },
        { id: '5', title: 'Thinking Out Loud', composer: 'Ed Sheeran', genre: 'Pop' },
      ])
    }
  }

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId)
    setSelectedSongs([]) // Reset songs when changing pack
  }

  const handleSongToggle = (songId: string) => {
    const pack = packs.find(p => p.id === selectedPack)
    if (!pack) return

    if (selectedSongs.includes(songId)) {
      setSelectedSongs(prev => prev.filter(id => id !== songId))
    } else if (selectedSongs.length < 3) { // Máximo 3 canciones
      setSelectedSongs(prev => [...prev, songId])
    }
  }

  const handleCustomSongAdd = () => {
    setCustomSongs(prev => [...prev, { title: '', source: '' }])
  }

  const handleCustomSongChange = (index: number, field: string, value: string) => {
    setCustomSongs(prev => prev.map((song, i) => 
      i === index ? { ...song, [field]: value } : song
    ))
  }

  const handleCustomSongRemove = (index: number) => {
    setCustomSongs(prev => prev.filter((_, i) => i !== index))
  }

  const handleStep1Complete = () => {
    if (!selectedPack) return
    onStepComplete({ pack: selectedPack })
  }

  const handleStep2Complete = () => {
    const pack = packs.find(p => p.id === selectedPack)
    if (!pack || selectedSongs.length === 0) return
    onStepComplete({ songIds: selectedSongs })
  }

  const handleStep3Complete = () => {
    onStepComplete({ customSongs })
  }

  const handleStep4Complete = () => {
    if (!clientData.firstName || !clientData.lastName || !clientData.email) return
    onStepComplete({ client: clientData })
  }

  const handleFinalSubmit = () => {
    const finalData = {
      client: clientData,
      pack: selectedPack,
      weddingDate: clientData.weddingDate,
      venue: clientData.venue,
      ceremonyMoments,
      ceremonySongs,
      cocktailStyles,
      cocktailComment,
      customSongs,
      firstPersonName,
      secondPersonName
    }
    onSubmit(finalData)
  }

  const selectedPackData = packs.find(p => p.id === selectedPack)
  const totalPrice = selectedPackData?.price || 0

  // Step 1: Pack Selection
  if (currentStep === 1) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          {t('configure.steps.pack')}
        </h2>
        <p className="text-gray-600 mb-8">
          {t('configure.subtitle')}
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all relative ${
                selectedPack === pack.id
                  ? 'border-orange-500 bg-orange-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              } ${pack.isPopular ? 'border-orange-500' : ''}`}
              onClick={() => handlePackSelect(pack.id)}
            >
              {pack.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Más popular
                  </span>
                </div>
              )}
              
              {/* Indicador de selección */}
              {selectedPack === pack.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-black mb-2">
                {pack.name}
              </h3>
              <p className="text-gray-600 mb-4">{pack.description}</p>
              <div className="text-3xl font-bold text-orange-600 mb-4">
                {pack.price}€
              </div>
              <ul className="space-y-2">
                {pack.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-black">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Resumen del pack seleccionado */}
        {selectedPack && (
          <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Pack seleccionado: {packs.find(p => p.id === selectedPack)?.name}
            </h3>
            <p className="text-orange-700">
              {packs.find(p => p.id === selectedPack)?.description} - {packs.find(p => p.id === selectedPack)?.price}€
            </p>
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleStep1Complete}
            disabled={!selectedPack}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Continuar
          </Button>
        </div>
      </div>
    )
  }

  // Step 2: Ceremony Moments (for ceremonia and completo)
  if (currentStep === 2 && (selectedPack === 'CEREMONIA' || selectedPack === 'CEREMONIA_APERITIVO_1H' || selectedPack === 'CEREMONIA_APERITIVO_1_5H')) {
    const ceremonyMomentsOptions = [
      { id: 'primera_entrada', name: 'Primera entrada', required: true },
      { id: 'segunda_entrada', name: 'Segunda entrada', required: true },
      { id: 'comunion', name: 'Comunión', required: false },
      { id: 'pausas', name: 'Pausas', required: false },
      { id: 'anillos', name: 'Anillos', required: false },
      { id: 'parlamentos', name: 'Parlamentos', required: false },
      { id: 'salida', name: 'Salida', required: true },
    ]

    const handleMomentToggle = (momentId: string) => {
      const moment = ceremonyMomentsOptions.find(m => m.id === momentId)
      // No permitir deseleccionar momentos obligatorios
      if (moment?.required) return
      
      if (ceremonyMoments.includes(momentId)) {
        setCeremonyMoments(prev => prev.filter(id => id !== momentId))
      } else {
        setCeremonyMoments(prev => [...prev, momentId])
      }
    }

    const requiredMoments = ceremonyMomentsOptions.filter(m => m.required)
    const hasRequiredMoments = requiredMoments.every(m => ceremonyMoments.includes(m.id))

    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-serif font-bold text-black mb-6">
          Momentos de la ceremonia
        </h2>
        <p className="text-gray-600 mb-8">
          Selecciona los momentos en los que quieres música durante tu ceremonia
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {ceremonyMomentsOptions.map((moment) => (
            <div
              key={moment.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                ceremonyMoments.includes(moment.id)
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              } ${moment.required ? 'border-orange-500 bg-orange-50' : ''}`}
              onClick={() => handleMomentToggle(moment.id)}
            >
              {/* Indicador de selección */}
              {ceremonyMoments.includes(moment.id) && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="font-medium text-black">{moment.name}</span>
                {moment.required && (
                  <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                    Requerido
                  </span>
                )}
              </div>
              
            </div>
          ))}
        </div>

        {/* Resumen de momentos seleccionados */}
        {ceremonyMoments.length > 0 && (
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="text-lg font-semibold text-orange-800 mb-4">
              Momentos seleccionados ({ceremonyMoments.length})
            </h3>
            
            {/* Personalizar nombres de las personas */}
            <div className="space-y-3 mb-4">
              <h4 className="text-sm font-medium text-gray-700">Nombres de las personas que entrarán:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Primera persona:
                  </label>
                  <input
                    type="text"
                    value={firstPersonName}
                    onChange={(e) => setFirstPersonName(e.target.value)}
                    placeholder="Ej: Maria"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Segunda persona:
                  </label>
                  <input
                    type="text"
                    value={secondPersonName}
                    onChange={(e) => setSecondPersonName(e.target.value)}
                    placeholder="Ej: Juan"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {ceremonyMoments.map(momentId => {
                const moment = ceremonyMomentsOptions.find(m => m.id === momentId)
                let displayName = moment?.name || ''
                
                // Personalizar nombres de las entradas
                if (momentId === 'primera_entrada' && firstPersonName) {
                  displayName = `Entrada ${firstPersonName}`
                } else if (momentId === 'segunda_entrada' && secondPersonName) {
                  displayName = `Entrada ${secondPersonName}`
                }
                
                return (
                  <span
                    key={momentId}
                    className={`px-3 py-1 rounded-full text-sm ${
                      moment?.required
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {displayName}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Atrás
          </Button>
          <Button
            onClick={() => {
              onStepComplete({ ceremonyMoments })
              onNextStep(3) // Ir a selección de canciones
            }}
            disabled={!hasRequiredMoments}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            Continuar
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: Song Selection for Ceremony Moments
  if (currentStep === 3 && (selectedPack === 'CEREMONIA' || selectedPack === 'CEREMONIA_APERITIVO_1H' || selectedPack === 'CEREMONIA_APERITIVO_1_5H')) {
    const ceremonyMomentsOptions = [
      { id: 'primera_entrada', name: 'Primera entrada', required: true },
      { id: 'segunda_entrada', name: 'Segunda entrada', required: true },
      { id: 'comunion', name: 'Comunión', required: false },
      { id: 'pausas', name: 'Pausas', required: false },
      { id: 'anillos', name: 'Anillos', required: false },
      { id: 'parlamentos', name: 'Parlamentos', required: false },
      { id: 'salida', name: 'Salida', required: true },
    ]

    const handleSongSelect = (momentId: string, songId: string) => {
      console.log('=== SONG SELECTION DEBUG ===')
      console.log('Current ceremonySongs:', ceremonySongs)
      console.log('Selecting songId:', songId, 'for momentId:', momentId)
      
      // Verificar si esta canción ya está seleccionada en OTRO momento
      const existingSelections = Object.entries(ceremonySongs)
      console.log('Existing selections:', existingSelections)
      
      const duplicateEntry = existingSelections.find(([otherMomentId, otherSongId]) => 
        otherMomentId !== momentId && otherSongId === songId
      )
      
      console.log('Duplicate entry found:', duplicateEntry)
      const isDuplicate = !!duplicateEntry

      // Actualizar la selección
      setCeremonySongs(prev => {
        const newSongs = { ...prev, [momentId]: songId }
        console.log('Updated ceremonySongs:', newSongs)
        return newSongs
      })

      // Mostrar aviso si hay duplicado
      if (isDuplicate) {
        console.log('DUPLICATE DETECTED! Showing warning...')
        const song = songs.find((s: any) => s.id === songId)
        const customSong = customSongs.find((s: any) => s.id === songId)
        const songTitle = song?.title || customSong?.title || 'Canción personalizada'
        setDuplicateSongWarning(`⚠️ La canción "${songTitle}" ya está seleccionada en otro momento`)
        
        // Limpiar el aviso después de 5 segundos
        setTimeout(() => {
          setDuplicateSongWarning(null)
        }, 5000)
      } else {
        console.log('No duplicate found, clearing warning')
        setDuplicateSongWarning(null)
      }

      // Scroll automático al siguiente momento
      setTimeout(() => {
        const selectedMoments = getSelectedMoments()
        const currentIndex = selectedMoments.findIndex(moment => moment.id === momentId)
        const nextMoment = selectedMoments[currentIndex + 1]
        
        if (nextMoment) {
          const nextElement = document.getElementById(`moment-${nextMoment.id}`)
          if (nextElement) {
            nextElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            })
          }
        }
      }, 300) // Pequeño delay para que se vea la selección
    }

    const getSelectedMoments = () => {
      return ceremonyMomentsOptions
        .filter(moment => ceremonyMoments.includes(moment.id))
        .map(moment => {
          let displayName = moment.name
          
          // Personalizar nombres de las entradas
          if (moment.id === 'primera_entrada' && firstPersonName) {
            displayName = `Entrada ${firstPersonName}`
          } else if (moment.id === 'segunda_entrada' && secondPersonName) {
            displayName = `Entrada ${secondPersonName}`
          }
          
          return {
            ...moment,
            name: displayName
          }
        })
    }

    const allMomentsHaveSongs = () => {
      const selectedMoments = getSelectedMoments()
      return selectedMoments.every(moment => ceremonySongs[moment.id])
    }

    const hasDuplicateSongs = () => {
      const songIds = Object.values(ceremonySongs)
      const uniqueSongIds = [...new Set(songIds)]
      return songIds.length !== uniqueSongIds.length
    }

    const filteredSongs = songs.filter((song: any) => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.composer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.genre.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handlePlay = (songId: string) => {
      setPlayingSong(playingSong === songId ? null : songId)
    }

    const getSelectedSong = (momentId: string) => {
      const songId = ceremonySongs[momentId]
      if (!songId || songId === 'custom') return null
      return songs.find((song: any) => song.id === songId) || null
    }

    const handleCustomSongSubmit = (momentId: string) => {
      if (customSongTitle.trim() && customSongUrl.trim()) {
        const customSong = {
          id: `custom_${Date.now()}`,
          title: customSongTitle,
          composer: 'Personalizada',
          genre: 'Personalizada',
          url: customSongUrl
        }
        
        // Añadir a la lista de canciones personalizadas
        setCustomSongs(prev => [...prev, customSong])
        
        // Seleccionar la canción personalizada
        handleSongSelect(momentId, customSong.id)
        
        // Limpiar formulario
        setCustomSongTitle('')
        setCustomSongUrl('')
        setShowCustomForm(null)
      }
    }

    const handleCustomSongCancel = () => {
      setCustomSongTitle('')
      setCustomSongUrl('')
      setShowCustomForm(null)
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-serif font-bold text-black mb-6">
          Selecciona canciones para cada momento
        </h2>
            <p className="text-gray-600 mb-8">
              Elige una canción para cada momento de tu ceremonia. Puedes seleccionar de las canciones disponibles o usar una canción personalizada.
            </p>

            {/* Aviso de canción duplicada */}
            {duplicateSongWarning && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-yellow-800 font-medium">{duplicateSongWarning}</p>
                </div>
              </div>
            )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar canciones por título, compositor o género..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

            <div className="space-y-6">
              {getSelectedMoments().map((moment) => (
                <div key={moment.id} id={`moment-${moment.id}`} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-black">{moment.name}</h3>
                {moment.required && (
                  <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                    Requerido
                  </span>
                )}
              </div>

              {/* Song Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Song Browser */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Buscar y seleccionar canción
                  </label>
                  <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                    {filteredSongs.length > 0 ? (
                      <div className="space-y-1 p-2">
                        {filteredSongs.map((song: any) => (
                          <div
                            key={song.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              ceremonySongs[moment.id] === song.id
                                ? 'bg-orange-50 border-2 border-orange-500'
                                : 'hover:bg-gray-50 border-2 border-transparent'
                            }`}
                            onClick={() => handleSongSelect(moment.id, song.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-black">{song.title}</p>
                                <p className="text-sm text-gray-600">{song.composer}</p>
                                <p className="text-xs text-gray-500">{song.genre}</p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePlay(song.id)
                                }}
                                className="ml-2 p-2 text-gray-400 hover:text-orange-600"
                              >
                                {playingSong === song.id ? (
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                  </svg>
                                ) : (
                                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No se encontraron canciones
                      </div>
                    )}
                  </div>
                  
                  {/* Custom Song Option */}
                  <div className="mt-4">
                    {showCustomForm !== moment.id ? (
                      <button
                        onClick={() => setShowCustomForm(moment.id)}
                        className="w-full p-3 rounded-lg border-2 border-gray-200 hover:border-orange-300 transition-all"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="h-5 w-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-orange-600 font-medium">Añadir canción personalizada</span>
                        </div>
                      </button>
                    ) : (
                      <div className="border-2 border-orange-500 rounded-lg p-4 bg-orange-50">
                        <h4 className="text-sm font-medium text-orange-800 mb-3">Nueva canción personalizada</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-orange-700 mb-1">
                              Título de la canción *
                            </label>
                            <input
                              type="text"
                              value={customSongTitle}
                              onChange={(e) => setCustomSongTitle(e.target.value)}
                              placeholder="Ej: Nuestra canción especial"
                              className="w-full px-3 py-2 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-orange-700 mb-1">
                              URL del audio *
                            </label>
                            <input
                              type="url"
                              value={customSongUrl}
                              onChange={(e) => setCustomSongUrl(e.target.value)}
                              placeholder="https://ejemplo.com/audio.mp3"
                              className="w-full px-3 py-2 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCustomSongSubmit(moment.id)}
                              disabled={!customSongTitle.trim() || !customSongUrl.trim()}
                              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                              Añadir
                            </button>
                            <button
                              onClick={handleCustomSongCancel}
                              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Vista previa
                  </label>
                  {ceremonySongs[moment.id] ? (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {(() => {
                        const selectedSong = getSelectedSong(moment.id)
                        const isCustomSong = ceremonySongs[moment.id]?.startsWith('custom_')
                        
                        if (isCustomSong) {
                          const customSongId = ceremonySongs[moment.id]?.replace('custom_', '')
                          const customSong = customSongs[parseInt(customSongId || '0')]
                          return customSong ? (
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-medium text-black">{customSong.title}</p>
                                  <p className="text-sm text-orange-600">Canción personalizada</p>
                                  {customSong.source && <p className="text-xs text-gray-500">URL: {customSong.source}</p>}
                                </div>
                                <button
                                  disabled
                                  className="p-2 text-gray-300 cursor-not-allowed"
                                  title="No se puede reproducir canción personalizada"
                                >
                                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                  </svg>
                                </button>
                              </div>
                              
                              {/* Info for Custom Song */}
                              <div className="mt-3 p-2 bg-orange-100 rounded text-sm text-orange-700">
                                <p>ℹ️ Esta canción personalizada se enviará por email para revisión</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500">Canción personalizada no encontrada</p>
                          )
                        } else if (selectedSong) {
                          return (
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-medium text-black">{selectedSong.title}</p>
                                  <p className="text-sm text-gray-600">{selectedSong.composer}</p>
                                  <p className="text-xs text-gray-500">{selectedSong.genre}</p>
                                </div>
                                <button
                                  onClick={() => handlePlay(selectedSong.id)}
                                  className="p-2 text-gray-400 hover:text-orange-600"
                                >
                                  {playingSong === selectedSong.id ? (
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                    </svg>
                                  ) : (
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M8 5v14l11-7z"/>
                                    </svg>
                                  )}
                                </button>
                              </div>
                              
                              {/* Audio Player */}
                              {playingSong === selectedSong.id && (
                                <div className="mt-3">
                                  <audio
                                    controls
                                    className="w-full"
                                    src={`/uploads/audio/${selectedSong.id}.mp3`}
                                  >
                                    Tu navegador no soporta el elemento de audio.
                                  </audio>
                                </div>
                              )}
                            </div>
                          )
                        } else {
                          return <p className="text-gray-500">Canción no encontrada</p>
                        }
                      })()}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-500">Selecciona una canción</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje de validación */}
        {hasDuplicateSongs() && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-medium">
                No puedes continuar: hay canciones duplicadas. Cada momento debe tener una canción diferente.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Atrás
          </Button>
              <Button
                onClick={() => {
                  onStepComplete({ ceremonySongs })
                  if (selectedPack === 'CEREMONIA_APERITIVO_1H' || selectedPack === 'CEREMONIA_APERITIVO_1_5H') {
                    // Si es completo, ir a estilos de cóctel
                    onNextStep(4)
                  } else {
                    // Si es solo ceremonia, ir a datos del cliente
                    onNextStep(5)
                  }
                }}
                disabled={!allMomentsHaveSongs() || hasDuplicateSongs()}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
              >
                Continuar
              </Button>
        </div>
      </div>
    )
  }

  // Step 2: Cocktail Styles (for coctel)
  if (currentStep === 2 && (selectedPack === 'APERITIVO_1H' || selectedPack === 'APERITIVO_1_5H')) {
    const styleOptions = [
      { id: 'clasica', name: 'Clásica' },
      { id: 'jazz', name: 'Jazz' },
      { id: 'pop', name: 'Pop' },
      { id: 'folk', name: 'Folk' },
      { id: 'latin', name: 'Latina' },
      { id: 'rock', name: 'Rock' },
    ]

    const handleStyleToggle = (styleId: string) => {
      if (cocktailStyles.includes(styleId)) {
        // Solo permitir deseleccionar si hay más de 3 elementos seleccionados
        if (cocktailStyles.length > 3) {
          setCocktailStyles(prev => prev.filter(id => id !== styleId))
        }
      } else {
        setCocktailStyles(prev => [...prev, styleId])
      }
    }

    const handleSelectAll = () => {
      setCocktailStyles(styleOptions.map(style => style.id))
    }

    const handleDeselectAll = () => {
      setCocktailStyles([])
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-serif font-bold text-black mb-6">
          Estilos para el cóctel
        </h2>
        <p className="text-gray-600 mb-4">
          El cóctel es música para amenizar variada de muchos estilos. 
          Todos los estilos están seleccionados por defecto. Puedes desmarcar hasta 3 estilos que no te gusten:
        </p>

        {/* Botones de selección */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={handleSelectAll}
            className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-md text-sm font-medium"
          >
            Seleccionar todo
          </button>
        </div>

        {/* Indicador de selección */}
        <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <strong>Estilos seleccionados:</strong> {cocktailStyles.length} de 6
            {cocktailStyles.length > 3 && (
              <span className="text-green-600 ml-2">✓ Puedes deseleccionar hasta {cocktailStyles.length - 3} más</span>
            )}
            {cocktailStyles.length <= 3 && (
              <span className="text-red-600 ml-2">⚠️ Mínimo 3 estilos requeridos</span>
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {styleOptions.map((style) => (
            <div
              key={style.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                cocktailStyles.includes(style.id)
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleStyleToggle(style.id)}
            >
              {/* Indicador de selección */}
              {cocktailStyles.includes(style.id) && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
              )}
              
              <span className="font-medium text-black">{style.name}</span>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-black mb-2">
            Comentarios adicionales (opcional)
          </label>
          <textarea
            value={cocktailComment}
            onChange={(e) => setCocktailComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent text-black"
            rows={3}
            placeholder="Cualquier preferencia especial o comentario sobre la música del cóctel..."
          />
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Atrás
          </Button>
              <Button
                onClick={() => {
                  onStepComplete({ cocktailStyles, cocktailComment })
                  onNextStep(5) // Ir a datos del cliente
                }}
                disabled={cocktailStyles.length < 3}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
              >
                Continuar
              </Button>
        </div>
      </div>
    )
  }

  // Step 4: Cocktail Styles (for completo after ceremonia)
  if (currentStep === 4 && (selectedPack === 'CEREMONIA_APERITIVO_1H' || selectedPack === 'CEREMONIA_APERITIVO_1_5H')) {
    const styleOptions = [
      { id: 'clasica', name: 'Clásica' },
      { id: 'jazz', name: 'Jazz' },
      { id: 'pop', name: 'Pop' },
      { id: 'folk', name: 'Folk' },
      { id: 'latin', name: 'Latina' },
      { id: 'rock', name: 'Rock' },
    ]

    const handleStyleToggle = (styleId: string) => {
      if (cocktailStyles.includes(styleId)) {
        // Solo permitir deseleccionar si hay más de 3 elementos seleccionados
        if (cocktailStyles.length > 3) {
          setCocktailStyles(prev => prev.filter(id => id !== styleId))
        }
      } else {
        setCocktailStyles(prev => [...prev, styleId])
      }
    }

    const handleSelectAll = () => {
      setCocktailStyles(styleOptions.map(style => style.id))
    }

    const handleDeselectAll = () => {
      setCocktailStyles([])
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-serif font-bold text-black mb-6">
          Estilos para el cóctel
        </h2>
        <p className="text-gray-600 mb-4">
          El cóctel es música para amenizar variada de muchos estilos. 
          Todos los estilos están seleccionados por defecto. Puedes desmarcar hasta 3 estilos que no te gusten:
        </p>

        {/* Botones de selección */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={handleSelectAll}
            className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-md text-sm font-medium"
          >
            Seleccionar todo
          </button>
        </div>

        {/* Indicador de selección */}
        <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            <strong>Estilos seleccionados:</strong> {cocktailStyles.length} de 6
            {cocktailStyles.length > 3 && (
              <span className="text-green-600 ml-2">✓ Puedes deseleccionar hasta {cocktailStyles.length - 3} más</span>
            )}
            {cocktailStyles.length <= 3 && (
              <span className="text-red-600 ml-2">⚠️ Mínimo 3 estilos requeridos</span>
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {styleOptions.map((style) => (
            <div
              key={style.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all relative ${
                cocktailStyles.includes(style.id)
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleStyleToggle(style.id)}
            >
              {/* Indicador de selección */}
              {cocktailStyles.includes(style.id) && (
                <div className="absolute top-3 right-3">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
              )}
              
              <span className="font-medium text-black">{style.name}</span>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-black mb-2">
            Comentarios adicionales (opcional)
          </label>
          <textarea
            value={cocktailComment}
            onChange={(e) => setCocktailComment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold-500 focus:border-transparent text-black"
            rows={3}
            placeholder="Cualquier preferencia especial o comentario sobre la música del cóctel..."
          />
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Atrás
          </Button>
              <Button
                onClick={() => {
                  onStepComplete({ cocktailStyles, cocktailComment })
                  onNextStep(5) // Ir a datos del cliente
                }}
                disabled={cocktailStyles.length < 3}
                className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white"
              >
                Continuar
              </Button>
        </div>
      </div>
    )
  }

  // Step 2: Song Selection (legacy - not used anymore)
  if (currentStep === 2) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          Elige tus canciones
        </h2>
        <p className="text-gray-600 mb-4">
          Selecciona hasta 3 canciones de nuestro repertorio
        </p>
        <p className="text-sm text-amber-600 mb-8">
          {selectedSongs.length} de 3 canciones seleccionadas
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {songs && songs.length > 0 ? songs.map((song) => (
            <div
              key={song.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedSongs.includes(song.id)
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSongToggle(song.id)}
            >
              <h4 className="font-semibold text-gray-900 mb-1">{song.title}</h4>
              {song.composer && (
                <p className="text-sm text-gray-600 mb-2">{song.composer}</p>
              )}
              {song.genre && (
                <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                  {song.genre}
                </span>
              )}
            </div>
          )) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              Cargando canciones...
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Atrás
          </Button>
          <Button
            onClick={handleStep2Complete}
            disabled={selectedSongs.length === 0}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Continuar
          </Button>
        </div>
      </div>
    )
  }

  // Step 3: Custom Songs
  if (currentStep === 3) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
          Canciones personalizadas
        </h2>
        <p className="text-gray-600 mb-4">
          ¿Tienes alguna canción especial que te gustaría incluir? (Opcional)
        </p>
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-gold-800">
            <strong>Nota:</strong> Para las canciones personalizadas, te enviaré un audio con la preview de cómo sonará. 
            Puedes solicitar hasta 3 canciones personalizadas.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {customSongs.map((song, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium text-gray-900">Canción {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCustomSongRemove(index)}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Eliminar
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título de la canción
                  </label>
                  <input
                    type="text"
                    value={song.title}
                    onChange={(e) => handleCustomSongChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Ej: Canción de mi boda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enlace (opcional)
                  </label>
                  <input
                    type="url"
                    value={song.source || ''}
                    onChange={(e) => handleCustomSongChange(index, 'source', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={handleCustomSongAdd}
          className="mb-8"
        >
          <Music className="h-4 w-4 mr-2" />
          Añadir canción personalizada
        </Button>

        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Atrás
          </Button>
          <Button
            onClick={handleStep3Complete}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Continuar
          </Button>
        </div>
      </div>
    )
  }

      // Step 5: Date Selection
      if (currentStep === 5) {
        // Generar días del mes actual
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()
        const startingDayOfWeek = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1 // Lunes = 0
        
        const handleMonthChange = (direction: 'prev' | 'next') => {
          if (direction === 'prev') {
            if (currentMonth === 0) {
              setCurrentMonth(11)
              setCurrentYear(currentYear - 1)
            } else {
              setCurrentMonth(currentMonth - 1)
            }
          } else {
            if (currentMonth === 11) {
              setCurrentMonth(0)
              setCurrentYear(currentYear + 1)
            } else {
              setCurrentMonth(currentMonth + 1)
            }
          }
        }
        
        const handleDateSelect = (date: string) => {
          setClientData(prev => ({ ...prev, weddingDate: date }))
        }

        const isDateBusy = (date: string) => {
          return busyDates.includes(date)
        }

        const isDatePast = (date: string) => {
          const selectedDate = new Date(date)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          return selectedDate < today
        }

        const formatDate = (day: number) => {
          const date = new Date(currentYear, currentMonth, day)
          return date.toISOString().split('T')[0]
        }

        return (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-serif font-bold text-black mb-6">
              Selecciona la fecha de tu boda
            </h2>
            <p className="text-gray-600 mb-8">
              Elige una fecha disponible para tu boda.
            </p>

            {loadingDates ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <span className="ml-3 text-gray-600">Cargando disponibilidad...</span>
              </div>
            ) : (
              <div className="mb-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => handleMonthChange('prev')}
                      className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { 
                        month: 'long', 
                        year: 'numeric' 
                      }).charAt(0).toUpperCase() + 
                      new Date(currentYear, currentMonth).toLocaleDateString('es-ES', { 
                        month: 'long', 
                        year: 'numeric' 
                      }).slice(1)}
                    </h3>
                    <button
                      onClick={() => handleMonthChange('next')}
                      className="p-2 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Header del calendario */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Días del calendario */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Días vacíos del mes anterior */}
                    {Array.from({ length: startingDayOfWeek }, (_, i) => (
                      <div key={`empty-${i}`} className="h-10"></div>
                    ))}
                    
                    {/* Días del mes actual */}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1
                      const date = formatDate(day)
                      const isBusy = isDateBusy(date)
                      const isPast = isDatePast(date)
                      const isSelected = clientData.weddingDate === date
                      const isDisabled = isBusy || isPast

                      return (
                        <button
                          key={day}
                          onClick={() => !isDisabled && handleDateSelect(date)}
                          disabled={isDisabled}
                          className={`h-10 w-10 rounded-md text-sm font-medium transition-colors ${
                            isSelected
                              ? 'bg-orange-600 text-white'
                              : isBusy
                              ? 'bg-red-100 text-red-600 cursor-not-allowed'
                              : isPast
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-white text-gray-900 hover:bg-orange-50 hover:text-orange-600'
                          }`}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {clientData.weddingDate && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-orange-800 font-medium">
                      Fecha seleccionada: {new Date(clientData.weddingDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="border-black text-black hover:bg-black hover:text-white"
              >
                Atrás
              </Button>
              <Button
                onClick={() => {
                  onStepComplete({ weddingDate: clientData.weddingDate })
                  onNextStep(6) // Ir a datos del cliente
                }}
                disabled={!clientData.weddingDate}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Continuar
              </Button>
            </div>
          </div>
        )
      }

      // Step 6: Client Information
      if (currentStep === 6) {
        return (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-serif font-bold text-black mb-6">
              Tus datos
            </h2>
            <p className="text-gray-600 mb-8">
              Por favor, introduce tus datos para continuar con la configuración de tu boda.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={clientData.firstName}
                  onChange={(e) => setClientData(prev => ({ ...prev, firstName: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black ${
                    formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Apellidos *
                </label>
                <input
                  type="text"
                  value={clientData.lastName}
                  onChange={(e) => setClientData(prev => ({ ...prev, lastName: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black ${
                    formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={clientData.email}
                  onChange={(e) => setClientData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={clientData.phone}
                  onChange={(e) => setClientData(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nombre de tu pareja (opcional)
                </label>
                <input
                  type="text"
                  value={clientData.partnerName}
                  onChange={(e) => setClientData(prev => ({ ...prev, partnerName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Lugar de la boda (opcional)
                </label>
                <input
                  type="text"
                  value={clientData.venue}
                  onChange={(e) => setClientData(prev => ({ ...prev, venue: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black ${
                    formErrors.venue ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.venue && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.venue}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Preferencia de idioma de contacto
                </label>
                <select
                  value={clientData.languagePreference}
                  onChange={(e) => setClientData(prev => ({ ...prev, languagePreference: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                >
                  <option value="castellano">Castellano</option>
                  <option value="catalan">Català</option>
                </select>
              </div>
            </div>

            {/* Mensaje de confirmación */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    ¡Perfecto! Me pondré en contacto contigo en menos de 24 horas
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>Te contactaré para:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Confirmar todos los detalles de tu boda</li>
                      <li>Acordar las canciones específicas</li>
                      <li>Cerrar el contrato y formalizar el servicio</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="border-black text-black hover:bg-black hover:text-white"
              >
                Atrás
              </Button>
              <Button
                onClick={() => {
                  const finalData = {
                    client: clientData,
                    pack: selectedPack,
                    weddingDate: clientData.weddingDate,
                    venue: clientData.venue,
                    ceremonyMoments,
                    ceremonySongs,
                    cocktailStyles,
                    cocktailComment,
                    customSongs
                  }
                  onSubmit(finalData)
                }}
                disabled={!clientData.firstName || !clientData.lastName || !clientData.email}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Enviar solicitud
              </Button>
            </div>
          </div>
        )
      }

  // Step 7: Success
  if (currentStep === 7) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
          ¡Solicitud enviada correctamente!
        </h2>
        <p className="text-gray-600 mb-8">
          Hemos recibido tu solicitud. Pronto recibirás un email con la propuesta detallada.
        </p>
        <div className="bg-amber-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-2">Resumen de tu solicitud:</h3>
          <p><strong>Pack:</strong> {selectedPackData?.name}</p>
          <p><strong>Precio:</strong> {totalPrice}€</p>
          <p><strong>Email:</strong> {clientData.email}</p>
        </div>
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-black text-black hover:bg-black hover:text-white"
          >
            Atrás
          </Button>
          <Button
            onClick={() => {
              if (validateForm()) {
                setShowConfirmation(true)
              }
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Enviar solicitud
          </Button>
        </div>
      </div>
    )
  }

  // Modal de confirmación
  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirma tu solicitud</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Datos personales:</h3>
                <p><strong>Nombre:</strong> {clientData.firstName} {clientData.lastName}</p>
                <p><strong>Email:</strong> {clientData.email}</p>
                <p><strong>Teléfono:</strong> {clientData.phone}</p>
                <p><strong>Pareja:</strong> {clientData.partnerName || 'No especificado'}</p>
                <p><strong>Idioma de contacto:</strong> {clientData.languagePreference === 'castellano' ? 'Castellano' : 'Català'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Detalles de la boda:</h3>
                <p><strong>Pack seleccionado:</strong> {
                  selectedPack === 'CEREMONIA' ? 'Solo Ceremonia' :
                  selectedPack === 'COCTEL' ? 'Solo Cóctel' :
                  selectedPack === 'CEREMONIA_APERITIVO_1H' ? 'Ceremonia + Aperitivo (1h)' :
                  selectedPack === 'CEREMONIA_APERITIVO_1_5H' ? 'Ceremonia + Aperitivo (1.5h)' :
                  selectedPack
                }</p>
                <p><strong>Fecha:</strong> {clientData.weddingDate ? new Date(clientData.weddingDate).toLocaleDateString('es-ES') : 'No especificada'}</p>
                <p><strong>Lugar:</strong> {clientData.venue || 'No especificado'}</p>
              </div>

              {ceremonyMoments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Momentos de la ceremonia:</h3>
                  <ul className="list-disc list-inside">
                    {ceremonyMoments.map(moment => {
                      let displayName = ''
                      if (moment === 'primera_entrada' && firstPersonName) {
                        displayName = `Entrada ${firstPersonName}`
                      } else if (moment === 'segunda_entrada' && secondPersonName) {
                        displayName = `Entrada ${secondPersonName}`
                      } else {
                        const defaultNames = {
                          'primera_entrada': 'Primera entrada',
                          'segunda_entrada': 'Segunda entrada',
                          'comunion': 'Comunión',
                          'pausas': 'Pausas',
                          'anillos': 'Anillos',
                          'parlamentos': 'Parlamentos',
                          'salida': 'Salida'
                        }
                        displayName = defaultNames[moment as keyof typeof defaultNames] || moment
                      }
                      return <li key={moment}>{displayName}</li>
                    })}
                  </ul>
                </div>
              )}

              {Object.keys(ceremonySongs).length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Canciones seleccionadas:</h3>
                  <ul className="list-disc list-inside">
                    {Object.entries(ceremonySongs).map(([moment, songId]) => {
                      let displayName = ''
                      if (moment === 'primera_entrada' && firstPersonName) {
                        displayName = `Entrada ${firstPersonName}`
                      } else if (moment === 'segunda_entrada' && secondPersonName) {
                        displayName = `Entrada ${secondPersonName}`
                      } else {
                        const defaultNames = {
                          'primera_entrada': 'Primera entrada',
                          'segunda_entrada': 'Segunda entrada',
                          'comunion': 'Comunión',
                          'pausas': 'Pausas',
                          'anillos': 'Anillos',
                          'parlamentos': 'Parlamentos',
                          'salida': 'Salida'
                        }
                        displayName = defaultNames[moment as keyof typeof defaultNames] || moment
                      }
                      return <li key={moment}><strong>{displayName}:</strong> Canción ID {songId}</li>
                    })}
                  </ul>
                </div>
              )}

              {cocktailStyles.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Estilos para el cóctel:</h3>
                  <ul className="list-disc list-inside">
                    {cocktailStyles.map(style => {
                      const styleNames = {
                        'clasica': 'Clásica',
                        'jazz': 'Jazz',
                        'pop': 'Pop',
                        'folk': 'Folk',
                        'latin': 'Latina',
                        'rock': 'Rock'
                      }
                      return <li key={style}>{styleNames[style as keyof typeof styleNames] || style}</li>
                    })}
                  </ul>
                </div>
              )}

              {cocktailComment && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Comentarios para el cóctel:</h3>
                  <p className="text-gray-700">{cocktailComment}</p>
                </div>
              )}

              {customSongs.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Canciones personalizadas:</h3>
                  <ul className="list-disc list-inside">
                    {customSongs.map((song, index) => (
                      <li key={index}><strong>{song.title}</strong>{song.source ? ` - URL: ${song.source}` : ''}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  const finalData = {
                    client: clientData,
                    pack: selectedPack,
                    weddingDate: clientData.weddingDate,
                    venue: clientData.venue,
                    ceremonyMoments,
                    ceremonySongs,
                    cocktailStyles,
                    cocktailComment,
                    customSongs,
                    firstPersonName,
                    secondPersonName
                  }
                  onSubmit(finalData)
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                Confirmar y enviar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
