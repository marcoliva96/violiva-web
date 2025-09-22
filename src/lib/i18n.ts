export type Language = 'es' | 'ca'

export const languages: Language[] = ['es', 'ca']

export const defaultLanguage: Language = 'es'

export const translations = {
  es: {
    // Navigation
    nav: {
      home: 'Inicio',
      proposal: 'Mi propuesta',
      gallery: 'Galería',
      listen: 'Escuchar',
      configure: 'Configurar',
      availability: 'Disponibilidad',
      contact: 'Contacto',
      admin: 'Admin'
    },
    // Home page
    home: {
      title: 'Música para tu boda perfecta',
      subtitle: 'Violín en vivo para crear momentos únicos e inolvidables',
      cta: 'Descubre mi propuesta',
      features: {
        title: '¿Por qué elegirme?',
        experience: 'Experiencia',
        experienceDesc: 'Más de 10 años tocando en bodas',
        repertoire: 'Repertorio',
        repertoireDesc: 'Música clásica, pop, jazz y personalizada',
        quality: 'Calidad',
        qualityDesc: 'Sonido profesional y equipamiento de alta calidad'
      }
    },
    // Proposal page
    proposal: {
      title: 'Mi propuesta',
      subtitle: 'Elige el pack que mejor se adapte a tu boda',
      packs: {
        ceremony: {
          name: 'Solo Ceremonia',
          description: 'Música para la ceremonia',
          price: '300€',
          features: [
            'Música para la ceremonia',
            'Selección de momentos',
            'Perfecto para ceremonias íntimas'
          ]
        },
        cocktail: {
          name: 'Solo Cóctel',
          description: 'Música para el cóctel',
          price: '250€',
          features: [
            'Música variada para cóctel',
            'Múltiples estilos',
            'Ambiente relajado'
          ]
        },
        complete: {
          name: 'Ceremonia + Cóctel',
          description: 'Servicio completo',
          price: '500€',
          features: [
            'Ceremonia + Cóctel',
            'Servicio completo',
            'Más popular'
          ]
        }
      }
    },
    // Configure page
    configure: {
      title: 'Configura tu boda',
      steps: {
        pack: 'Elige tu pack',
        ceremony: 'Momentos de la ceremonia',
        cocktail: 'Estilos para el cóctel',
        songs: 'Canciones personalizadas',
        client: 'Tus datos'
      },
      ceremony: {
        title: 'Momentos de la ceremonia',
        subtitle: 'Selecciona los momentos en los que quieres música durante tu ceremonia',
        moments: {
          entrada_ella: 'Entrada ella',
          entrada_el: 'Entrada él',
          comunion: 'Comunión',
          pausas: 'Pausas',
          anillos: 'Anillos',
          parlamentos: 'Parlamentos',
          salida: 'Salida'
        },
        required: 'Obligatorio'
      },
      cocktail: {
        title: 'Estilos para el cóctel',
        subtitle: 'El cóctel es música para amenizar variada de muchos estilos. Selecciona los estilos que prefieres (puedes desmarcar los que no te gusten):',
        styles: {
          clasica: 'Clásica',
          jazz: 'Jazz',
          pop: 'Pop',
          folk: 'Folk',
          latin: 'Latina',
          rock: 'Rock'
        },
        comment: 'Comentarios adicionales (opcional)',
        commentPlaceholder: 'Cualquier preferencia especial o comentario sobre la música del cóctel...'
      },
      customSongs: {
        title: 'Canciones personalizadas',
        subtitle: '¿Tienes alguna canción especial que te gustaría incluir? (Opcional)',
        note: 'Para las canciones personalizadas, te enviaré un audio con la preview de cómo sonará. Puedes solicitar hasta 3 canciones personalizadas.',
        addSong: 'Añadir canción',
        removeSong: 'Eliminar',
        songTitle: 'Título de la canción',
        songSource: 'Artista/Compositor'
      },
      client: {
        title: 'Tus datos',
        subtitle: 'Necesitamos algunos datos para crear tu propuesta personalizada',
        firstName: 'Nombre',
        lastName: 'Apellido',
        email: 'Email',
        phone: 'Teléfono',
        partnerName: 'Nombre de tu pareja',
        weddingDate: 'Fecha de la boda',
        venue: 'Lugar de la boda',
        availabilityLink: 'Consulta la disponibilidad antes de elegir'
      }
    },
    // Admin
    admin: {
      title: 'Panel de administración',
      dashboard: 'Dashboard',
      bookings: 'Solicitudes',
      songs: 'Canciones',
      clients: 'Clientes',
      analytics: 'Estadísticas',
      settings: 'Configuración',
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      welcome: 'Bienvenido',
      stats: {
        totalBookings: 'Total solicitudes',
        pendingBookings: 'Pendientes',
        completedBookings: 'Completadas',
        totalRevenue: 'Ingresos totales'
      }
    }
  },
  ca: {
    // Navigation
    nav: {
      home: 'Inici',
      proposal: 'La meva proposta',
      gallery: 'Galeria',
      listen: 'Escoltar',
      configure: 'Configurar',
      availability: 'Disponibilitat',
      contact: 'Contacte',
      admin: 'Admin'
    },
    // Home page
    home: {
      title: 'Música per al teu casament perfecte',
      subtitle: 'Violí en viu per crear moments únics i inoblidables',
      cta: 'Descobreix la meva proposta',
      features: {
        title: 'Per què triar-me?',
        experience: 'Experiència',
        experienceDesc: 'Més de 10 anys tocant en casaments',
        repertoire: 'Repertori',
        repertoireDesc: 'Música clàssica, pop, jazz i personalitzada',
        quality: 'Qualitat',
        qualityDesc: 'So professional i equipament d\'alta qualitat'
      }
    },
    // Proposal page
    proposal: {
      title: 'La meva proposta',
      subtitle: 'Tria el pack que millor s\'adapti al teu casament',
      packs: {
        ceremony: {
          name: 'Només Cerimònia',
          description: 'Música per a la cerimònia',
          price: '300€',
          features: [
            'Música per a la cerimònia',
            'Selecció de moments',
            'Perfecte per a cerimònies íntimes'
          ]
        },
        cocktail: {
          name: 'Només Còctel',
          description: 'Música per al còctel',
          price: '250€',
          features: [
            'Música variada per al còctel',
            'Múltiples estils',
            'Ambient relaxat'
          ]
        },
        complete: {
          name: 'Cerimònia + Còctel',
          description: 'Servei complet',
          price: '500€',
          features: [
            'Cerimònia + Còctel',
            'Servei complet',
            'Més popular'
          ]
        }
      }
    },
    // Configure page
    configure: {
      title: 'Configura el teu casament',
      steps: {
        pack: 'Tria el teu pack',
        ceremony: 'Moments de la cerimònia',
        cocktail: 'Estils per al còctel',
        songs: 'Cançons personalitzades',
        client: 'Les teves dades'
      },
      ceremony: {
        title: 'Moments de la cerimònia',
        subtitle: 'Selecciona els moments en què vols música durant la teva cerimònia',
        moments: {
          entrada_ella: 'Entrada ella',
          entrada_el: 'Entrada ell',
          comunion: 'Comunió',
          pausas: 'Pauses',
          anillos: 'Anells',
          parlamentos: 'Parlaments',
          salida: 'Sortida'
        },
        required: 'Obligatori'
      },
      cocktail: {
        title: 'Estils per al còctel',
        subtitle: 'El còctel és música per amenitzar variada de molts estils. Selecciona els estils que prefereixes (pots desmarcar els que no t\'agraden):',
        styles: {
          clasica: 'Clàssica',
          jazz: 'Jazz',
          pop: 'Pop',
          folk: 'Folk',
          latin: 'Llatina',
          rock: 'Rock'
        },
        comment: 'Comentaris addicionals (opcional)',
        commentPlaceholder: 'Qualsevol preferència especial o comentari sobre la música del còctel...'
      },
      customSongs: {
        title: 'Cançons personalitzades',
        subtitle: 'Tens alguna cançó especial que t\'agradaria incloure? (Opcional)',
        note: 'Per a les cançons personalitzades, t\'enviaré un àudio amb la preview de com sonarà. Pots sol·licitar fins a 3 cançons personalitzades.',
        addSong: 'Afegir cançó',
        removeSong: 'Eliminar',
        songTitle: 'Títol de la cançó',
        songSource: 'Artista/Compositor'
      },
      client: {
        title: 'Les teves dades',
        subtitle: 'Necessitem algunes dades per crear la teva proposta personalitzada',
        firstName: 'Nom',
        lastName: 'Cognom',
        email: 'Email',
        phone: 'Telèfon',
        partnerName: 'Nom del teu company',
        weddingDate: 'Data del casament',
        venue: 'Lloc del casament',
        availabilityLink: 'Consulta la disponibilitat abans de triar'
      }
    },
    // Admin
    admin: {
      title: 'Panell d\'administració',
      dashboard: 'Dashboard',
      bookings: 'Sol·licituds',
      songs: 'Cançons',
      clients: 'Clients',
      analytics: 'Estadístiques',
      settings: 'Configuració',
      login: 'Iniciar sessió',
      logout: 'Tancar sessió',
      welcome: 'Benvingut',
      stats: {
        totalBookings: 'Total sol·licituds',
        pendingBookings: 'Pendents',
        completedBookings: 'Completades',
        totalRevenue: 'Ingressos totals'
      }
    }
  }
}

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.')
  let value: any = translations[language]
  
  for (const k of keys) {
    value = value?.[k]
  }
  
  return value || key
}
