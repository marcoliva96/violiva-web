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
      title: 'Música a medida para acompañar\nvuestro momento más especial 💍',
      subtitle: 'Más de 10 años creando momentos únicos e irrepetibles en bodas. Mi experiencia y pasión por la música se unen para hacer de vuestro día especial algo inolvidable.',
      systemDescription: 'Sistema "Configurar boda" exclusivo y pionero: creado por y para parejas, que os permite escuchar con total fidelidad cómo sonará vuestra boda con mis servicios. Una experiencia innovadora que os brinda la seguridad de saber exactamente cómo sonará cada momento especial.',
      cta: 'Descubre mi propuesta',
      proposal: {
        title: 'Mi propuesta',
        ceremony: {
          title: 'Ceremonia',
          description: 'Para vuestra ceremonia, violín acompañado de bases profesionales pre-grabadas en estudio de grabación. Un sonido íntimo y elegante que realza cada momento especial sin robar protagonismo. Música clásica y contemporánea que crea la atmósfera perfecta para vuestro "sí, quiero". Puede ser religiosa o civil, con momentos musicales que amenizan ambas opciones y quedan perfectas en ambas.'
        },
        cocktail: {
          title: 'Cóctel',
          description: 'Para el cóctel, violín, guitarra y saxo con repertorio variado y actual. Una experiencia musical envolvente que da estilo y elegancia a vuestro aperitivo. Música que conecta con todos vuestros invitados, creando un ambiente único y memorable.'
        },
        otherServices: {
          title: 'Otros servicios',
          description: 'Si necesitas servicios para entierros, comuniones u otras celebraciones, puedes contactarme en la sección "Contacto" ya que ofrezco estos servicios.'
        }
      },
      experiences: {
        title: 'Experiencias (173 valoraciones)'
      },
      services: {
        title: 'Ventajas destacadas'
      },
      features: {
        title: '¿Por qué elegirme?',
        experience: 'Experiencia',
        experienceDesc: 'Más de 10 años tocando en bodas',
        repertoire: 'Repertorio',
        repertoireDesc: 'Música clásica, pop, jazz y personalizada',
        quality: 'Calidad',
        qualityDesc: 'Sonido profesional y equipamiento de alta calidad'
      },
      advantages: {
        title: 'Ventajas destacadas',
        elegant: {
          title: 'Hará que vuestra boda sea elegante y memorable',
          description: 'Sin partituras, sin imprevistos, sin electricidad. Una actuación que no os molestará en un día lleno de emociones y que os permitirá disfrutar plenamente.'
        },
        comfort: {
          title: 'Máxima comodidad en vuestro gran día',
          description: 'Sin partituras que distraigan, sin imprevistos y sin necesidad de gestionar nada in situ. Una actuación diseñada al detalle, con la excelencia y la elegancia que os permitirá vivir vuestra boda con total serenidad.'
        },
        system: {
          title: 'Sistema de preparación exclusivo',
          description: 'Un sistema de preparación exclusivo y pionero: creado por y para parejas, que os permite escuchar con total fidelidad cómo sonará vuestra boda con mis servicios. Una experiencia innovadora que os brinda la seguridad de saber exactamente cómo sonará cada momento especial.'
        }
      },
      packs: {
        title: 'Compara los packs',
        subtitle: 'Elige el pack que mejor se adapte a tu boda',
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
          price: '300€',
          features: [
            'Música variada para cóctel',
            'Múltiples estilos',
            'Ambiente relajado'
          ]
        },
        ceremonyCocktail1h: {
          name: 'Ceremonia + Aperitivo (1h)',
          description: 'Servicio completo (1h aperitivo)',
          price: '450€',
          features: [
            'Ceremonia + 1h Cóctel',
            'Servicio completo',
            'Más popular'
          ]
        },
        ceremonyCocktail1_5h: {
          name: 'Ceremonia + Aperitivo (1.5h)',
          description: 'Servicio completo (1.5h aperitivo)',
          price: '500€',
          features: [
            'Ceremonia + 1.5h Cóctel',
            'Servicio completo',
            'Ideal para eventos más largos'
          ]
        }
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
          price: '370€',
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
      subtitle: 'Selecciona el pack que mejor se adapte a tu boda',
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
          firma_civil: 'Firma del acta civil',
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
          title: 'Vuestros datos',
          subtitle: 'Necesitamos algunos datos para crear vuestra propuesta personalizada',
          firstName: 'Nombre',
          lastName: 'Apellidos',
          email: 'Email',
          phone: 'Teléfono',
          partnerName: 'Nombre de vuestra pareja',
          weddingDate: 'Fecha de la boda',
          venue: 'Lugar de la boda',
          availabilityLink: 'Consulta la disponibilidad antes de elegir',
          languagePreference: 'Preferencia de idioma de contacto',
          confirmationMessage: '¡Perfecto! Me pondré en contacto contigo en menos de 24 horas',
          confirmationDetails: 'Te contactaré para:',
          confirmationList: [
            'Confirmar todos los detalles de tu boda',
            'Acordar las canciones específicas',
            'Cerrar el contrato y formalizar el servicio'
          ]
        },
        packs: {
          CEREMONIA: 'Solo Ceremonia',
          COCTEL: 'Solo Cóctel',
          CEREMONIA_APERITIVO_1H: 'Ceremonia + Aperitivo (1h)',
          CEREMONIA_APERITIVO_1_5H: 'Ceremonia + Aperitivo (1.5h)'
        },
        buttons: {
          back: 'Atrás',
          next: 'Siguiente',
          submit: 'Enviar solicitud',
          confirm: 'Confirmar y enviar',
          cancel: 'Cancelar'
        },
        success: {
          title: '¡Solicitud enviada correctamente!',
          message: 'Hemos recibido tu solicitud.',
          contact: 'Me pondré en contacto contigo en menos de 24 horas',
          contactFor: 'Te contactaré para:',
          contactList: [
            'Confirmar todos los detalles de tu boda',
            'Acordar las canciones específicas',
            'Cerrar el contrato y formalizar el servicio'
          ],
          explore: 'Puedes seguir explorando la web o cerrar esta ventana.'
        }
    },
    // Listen page
    listen: {
      title: 'Escucha nuestro repertorio',
      subtitle: 'Descubre las canciones que pueden hacer de tu boda un momento único',
      searchPlaceholder: 'Buscar por título o compositor...',
      allGenres: 'Todos los géneros',
      featured: 'Destacadas',
      loading: 'Cargando canciones...',
      noResults: 'No se encontraron canciones con los filtros seleccionados',
      listen: 'Escuchar'
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
      configure: 'Configura la teva boda',
      availability: 'Disponibilitat',
      contact: 'Contacte',
      admin: 'Admin'
    },
    // Home page
    home: {
      title: 'Música a mida per acompanyar\nel vostre moment més especial 💍',
      subtitle: 'Més de 10 anys creant moments únics i irrepetibles en casaments. La meva experiència i passió per la música s\'uneixen per fer del vostre dia especial quelcom inoblidable.',
      systemDescription: 'Sistema "Configurar casament" exclusiu i pioner: creat per i per a parelles, que us permet escoltar amb total fidelitat com sonarà el vostre casament amb els meus serveis. Una experiència innovadora que us brinda la seguretat de saber exactament com sonarà cada moment especial.',
      cta: 'Descobreix la meva proposta',
      proposal: {
        title: 'La meva proposta',
        ceremony: {
          title: 'Cerimònia',
          description: 'Per a la vostra cerimònia, violí acompanyat de bases professionals pre-gravades en estudi de gravació. Un so íntim i elegant que realça cada moment especial sense robar protagonisme. Música clàssica i contemporània que crea l\'atmosfera perfecta per al vostre "sí, vull". Pot ser religiosa o civil, amb moments musicals que amenitzen ambdues opcions i queden perfectes en ambdues.'
        },
        cocktail: {
          title: 'Còctel',
          description: 'Per al còctel, violí, guitarra i saxo amb repertori variat i actual. Una experiència musical embolcallant que dóna estil i elegància al vostre aperitiu. Música que connecta amb tots els vostres convidats, creant un ambient únic i memorable.'
        },
        otherServices: {
          title: 'Altres serveis',
          description: 'Si necessites serveis per a enterraments, comunions o altres celebracions, pots contactar-me a la secció "Contacte" ja que ofereixo aquests serveis.'
        }
      },
      experiences: {
        title: 'Experiències (173 valoracions)'
      },
      services: {
        title: 'Avantatges destacats'
      },
      features: {
        title: 'Per què triar-me?',
        experience: 'Experiència',
        experienceDesc: 'Més de 10 anys tocant en casaments',
        repertoire: 'Repertori',
        repertoireDesc: 'Música clàssica, pop, jazz i personalitzada',
        quality: 'Qualitat',
        qualityDesc: 'So professional i equipament d\'alta qualitat'
      },
      advantages: {
        title: 'Avantatges destacats',
        elegant: {
          title: 'Farà que el vostre casament sigui elegant i memorable',
          description: 'Sense partitures, sense imprevistos, sense electricitat. Una actuació que no us molestarà en un dia ple d\'emocions i que us permetrà gaudir plenament.'
        },
        comfort: {
          title: 'Màxima comoditat en el vostre gran dia',
          description: 'Sense partitures que distreguin, sense imprevistos i sense necessitat de gestionar res in situ. Una actuació dissenyada al detall, amb l\'excel·lència i l\'elegància que us permetrà viure el vostre casament amb total serenitat.'
        },
        system: {
          title: 'Sistema de preparació exclusiu',
          description: 'Un sistema de preparació exclusiu i pioner: creat per i per a parelles, que us permet escoltar amb total fidelitat com sonarà el vostre casament amb els meus serveis. Una experiència innovadora que us brinda la seguretat de saber exactament com sonarà cada moment especial.'
        }
      },
      packs: {
        title: 'Compara els packs',
        subtitle: 'Tria el pack que millor s\'adapti al teu casament',
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
          price: '300€',
          features: [
            'Música variada per al còctel',
            'Múltiples estils',
            'Ambient relaxat'
          ]
        },
        ceremonyCocktail1h: {
          name: 'Cerimònia + Aperitiu (1h)',
          description: 'Servei complet (1h aperitiu)',
          price: '450€',
          features: [
            'Cerimònia + 1h Còctel',
            'Servei complet',
            'Més popular'
          ]
        },
        ceremonyCocktail1_5h: {
          name: 'Cerimònia + Aperitiu (1.5h)',
          description: 'Servei complet (1.5h aperitiu)',
          price: '500€',
          features: [
            'Cerimònia + 1.5h Còctel',
            'Servei complet',
            'Ideal per a esdeveniments més llargs'
          ]
        }
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
          price: '370€',
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
      subtitle: 'Selecciona el pack que millor s\'adapti al teu casament',
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
          firma_civil: 'Signatura de l\'acta civil',
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
          title: 'Les vostres dades',
          subtitle: 'Necessitem algunes dades per crear la vostra proposta personalitzada',
          firstName: 'Nom',
          lastName: 'Cognoms',
          email: 'Email',
          phone: 'Telèfon',
          partnerName: 'Nom del vostre company',
          weddingDate: 'Data del casament',
          venue: 'Lloc del casament',
          availabilityLink: 'Consulta la disponibilitat abans de triar',
          languagePreference: 'Preferència d\'idioma de contacte',
          confirmationMessage: 'Perfecte! Em posaré en contacte amb tu en menys de 24 hores',
          confirmationDetails: 'Et contactaré per:',
          confirmationList: [
            'Confirmar tots els detalls del teu casament',
            'Acordar les cançons específiques',
            'Tancar el contracte i formalitzar el servei'
          ]
        },
        packs: {
          CEREMONIA: 'Només Cerimònia',
          COCTEL: 'Només Còctel',
          CEREMONIA_APERITIVO_1H: 'Cerimònia + Aperitiu (1h)',
          CEREMONIA_APERITIVO_1_5H: 'Cerimònia + Aperitiu (1.5h)'
        },
        buttons: {
          back: 'Enrere',
          next: 'Següent',
          submit: 'Enviar sol·licitud',
          confirm: 'Confirmar i enviar',
          cancel: 'Cancel·lar'
        },
        success: {
          title: '¡Sol·licitud enviada correctament!',
          message: 'Hem rebut la teva sol·licitud.',
          contact: 'Em posaré en contacte amb tu en menys de 24 hores',
          contactFor: 'Et contactaré per:',
          contactList: [
            'Confirmar tots els detalls del teu casament',
            'Acordar les cançons específiques',
            'Tancar el contracte i formalitzar el servei'
          ],
          explore: 'Pots seguir explorant la web o tancar aquesta finestra.'
        }
    },
    // Listen page
    listen: {
      title: 'Escolta el nostre repertori',
      subtitle: 'Descobreix les cançons que poden fer del teu casament un moment únic',
      searchPlaceholder: 'Buscar per títol o compositor...',
      allGenres: 'Tots els gèneres',
      featured: 'Destacades',
      loading: 'Carregant cançons...',
      noResults: 'No s\'han trobat cançons amb els filtres seleccionats',
      listen: 'Escoltar'
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
    },
    calendar: {
      months: [
        'Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny',
        'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'
      ],
      weekdays: [
        'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'
      ]
    },
    stats: {
      weddings: 'Casaments realitzats',
      experience: 'Anys d\'experiència',
      satisfaction: 'Clients satisfets'
    },
    advantages: {
      title: 'Avantatges destacats',
      elegant: {
        title: 'Farà que el vostre casament sigui elegant i memorable',
        description: 'Sense partitures, sense imprevistos, sense electricitat. Una actuació que no us molestará en un dia ple d\'emocions i que us permetrà gaudir plenament.'
      },
      comfort: {
        title: 'Màxima comoditat en el vostre gran dia',
        description: 'Sense partitures que distreguin, sense imprevistos i sense necessitat de gestionar res in situ. Una actuació dissenyada al detall, amb l\'excel·lència i l\'elegància que us permetrà viure el vostre casament amb total serenitat.'
      },
      system: {
        title: 'Sistema de preparació exclusiu',
        description: 'Un sistema de preparació exclusiu i pioner: creat per i per a parelles, que us permet escoltar amb total fidelitat com sonarà el vostre casament amb els meus serveis. Una experiència innovadora que us brinda la seguretat de saber exactament com sonarà cada moment especial.'
      }
    },
    packs: {
      title: 'Compara els packs',
      subtitle: 'Tria el pack que millor s\'adapti al teu casament',
      ceremony: {
        name: 'Només Cerimònia',
        description: 'Música per a la cerimònia',
        price: '200€',
        features: [
          'Música per a la cerimònia',
          'Selecció de moments',
          'Perfecte per a cerimònies íntimes'
        ]
      },
      cocktail: {
        name: 'Només Còctel',
        description: 'Música per al còctel',
        price: '200€',
        features: [
          'Música variada per al còctel',
          'Múltiples estils',
          'Ambient relaxat'
        ]
      },
      ceremonyCocktail1h: {
        name: 'Cerimònia + Aperitiu (1h)',
        description: 'Servei complet (1h aperitiu)',
        price: '300€',
        features: [
          'Cerimònia + 1h Còctel',
          'Servei complet',
          'Més popular'
        ]
      },
      ceremonyCocktail1_5h: {
        name: 'Cerimònia + Aperitiu (1.5h)',
        description: 'Servei complet (1.5h aperitiu)',
        price: '340€',
        features: [
          'Cerimònia + 1.5h Còctel',
          'Servei complet',
          'Ideal per a esdeveniments més llargs'
        ]
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
