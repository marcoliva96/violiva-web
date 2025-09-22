import nodemailer from 'nodemailer'

// Configuración del transporter (para desarrollo, usaremos Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'marcoliva96@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password' // Necesitarás una contraseña de aplicación
  }
})

export async function sendBookingNotification(bookingData: {
  client: {
    firstName: string
    lastName: string
    email: string
    phone?: string
    partnerName?: string
  }
  pack: string
  weddingDate: string
  venue?: string
  ceremonyMoments?: string[]
  ceremonySongs?: Record<string, string>
  cocktailStyles?: string[]
  cocktailComment?: string
  customSongs?: Array<{title: string, url?: string}>
  firstPersonName?: string
  secondPersonName?: string
}) {
  const { client, pack, weddingDate, venue, ceremonyMoments, ceremonySongs, cocktailStyles, cocktailComment, customSongs, firstPersonName = '', secondPersonName = '' } = bookingData

  // Formatear la fecha
  const date = new Date(weddingDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Formatear el pack
  const packNames = {
    'CEREMONIA': 'Solo Ceremonia',
    'COCTEL': 'Solo Cóctel', 
    'COMPLETO': 'Ceremonia + Cóctel'
  }

  // Construir el contenido del email
  let emailContent = `
<h2>Nueva solicitud de boda recibida</h2>

<h3>Datos del cliente:</h3>
<ul>
  <li><strong>Nombre:</strong> ${client.firstName} ${client.lastName}</li>
  <li><strong>Email:</strong> ${client.email}</li>
  <li><strong>Teléfono:</strong> ${client.phone || 'No proporcionado'}</li>
  <li><strong>Pareja:</strong> ${client.partnerName || 'No proporcionado'}</li>
</ul>

<h3>Detalles de la boda:</h3>
<ul>
  <li><strong>Pack seleccionado:</strong> ${packNames[pack as keyof typeof packNames] || pack}</li>
  <li><strong>Fecha:</strong> ${date}</li>
  <li><strong>Lugar:</strong> ${venue || 'No especificado'}</li>
</ul>
`

  // Agregar detalles de ceremonia si aplica
  if (ceremonyMoments && ceremonyMoments.length > 0) {
    emailContent += `
<h3>Momentos de la ceremonia:</h3>
<ul>
${ceremonyMoments.map(moment => {
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
  
  return `<li>${displayName}</li>`
}).join('')}
</ul>
`
  }

  // Agregar canciones seleccionadas si hay
  if (ceremonySongs && Object.keys(ceremonySongs).length > 0) {
    emailContent += `
<h3>Canciones seleccionadas:</h3>
<ul>
${Object.entries(ceremonySongs).map(([moment, songId]) => {
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
  
  return `<li><strong>${displayName}:</strong> Canción ID ${songId}</li>`
}).join('')}
</ul>
`
  }

  // Agregar estilos de cóctel si aplica
  if (cocktailStyles && cocktailStyles.length > 0) {
    emailContent += `
<h3>Estilos para el cóctel:</h3>
<ul>
${cocktailStyles.map(style => {
  const styleNames = {
    'clasica': 'Clásica',
    'jazz': 'Jazz',
    'pop': 'Pop',
    'folk': 'Folk',
    'latin': 'Latina',
    'rock': 'Rock'
  }
  return `<li>${styleNames[style as keyof typeof styleNames] || style}</li>`
}).join('')}
</ul>
`
  }

  // Agregar comentarios del cóctel si hay
  if (cocktailComment) {
    emailContent += `
<h3>Comentarios para el cóctel:</h3>
<p>${cocktailComment}</p>
`
  }

  // Agregar canciones personalizadas si hay
  if (customSongs && customSongs.length > 0) {
    emailContent += `
<h3>Canciones personalizadas:</h3>
<ul>
${customSongs.map(song => `<li><strong>${song.title}</strong>${song.url ? ` - URL: ${song.url}` : ''}</li>`).join('')}
</ul>
`
  }

  const mailOptions = {
    from: process.env.EMAIL_USER || 'marcoliva96@gmail.com',
    to: 'marcoliva96@gmail.com',
    subject: `Nueva solicitud de boda - ${client.firstName} ${client.lastName}`,
    html: emailContent
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email de notificación enviado correctamente')
  } catch (error) {
    console.error('Error enviando email:', error)
    throw error
  }
}
