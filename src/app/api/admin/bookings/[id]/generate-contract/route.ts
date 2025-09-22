import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { generatePresignedUploadUrl } from '@/lib/aws'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        client: true,
        selections: {
          include: {
            song: true
          },
          orderBy: { orderIndex: 'asc' }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Generate PDF contract
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let yPosition = 800

    // Title
    page.drawText('Contrato de Prestación de Servicios Musicales', {
      x: 50,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    yPosition -= 30

    // Date
    page.drawText(`Fecha de emisión: ${new Date().toLocaleDateString('es-ES')}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    yPosition -= 40

    // Client info
    page.drawText('Datos del Cliente:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    yPosition -= 20

    page.drawText(`Nombre: ${booking.client.firstName} ${booking.client.lastName}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    yPosition -= 15

    page.drawText(`Email: ${booking.client.email}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    yPosition -= 15

    if (booking.client.phone) {
      page.drawText(`Teléfono: ${booking.client.phone}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      })
      yPosition -= 15
    }

    yPosition -= 20

    // Event details
    page.drawText('Detalles del Evento:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    yPosition -= 20

    page.drawText(`Fecha: ${booking.date.toLocaleDateString('es-ES')}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    yPosition -= 15

    if (booking.venue) {
      page.drawText(`Lugar: ${booking.venue}`, {
        x: 50,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      })
      yPosition -= 15
    }

    page.drawText(`Pack: ${booking.pack}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    yPosition -= 15

    page.drawText(`Precio: ${(booking.priceCents / 100).toFixed(2)} ${booking.currency}`, {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    yPosition -= 30

    // Song selections
    page.drawText('Canciones seleccionadas:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    yPosition -= 20

    for (const selection of booking.selections) {
      const songTitle = selection.song?.title || selection.customTitle || 'Canción personalizada'
      const composer = selection.song?.composer || ''
      
      page.drawText(`• ${songTitle}${composer ? ` - ${composer}` : ''}`, {
        x: 70,
        y: yPosition,
        size: 11,
        font: font,
        color: rgb(0, 0, 0),
      })
      yPosition -= 15
    }

    yPosition -= 30

    // Terms and conditions
    page.drawText('Términos y Condiciones:', {
      x: 50,
      y: yPosition,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    yPosition -= 20

    const terms = [
      '• El cliente se compromete a proporcionar un espacio adecuado para la actuación.',
      '• En caso de cancelación con menos de 48h de antelación, se cobrará el 50% del importe.',
      '• El pago se realizará en efectivo el día del evento o por transferencia bancaria.',
      '• El músico se reserva el derecho de cancelar por condiciones meteorológicas adversas.',
    ]

    for (const term of terms) {
      page.drawText(term, {
        x: 50,
        y: yPosition,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      })
      yPosition -= 15
    }

    yPosition -= 40

    // Signature lines
    page.drawText('Firma del Cliente:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    yPosition -= 30

    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: 250, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    })

    yPosition -= 20

    page.drawText('Firma del Músico:', {
      x: 50,
      y: yPosition,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    yPosition -= 30

    page.drawLine({
      start: { x: 50, y: yPosition },
      end: { x: 250, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    })

    // Save PDF to S3
    const pdfBytes = await pdfDoc.save()
    const fileName = `contracts/contract-${booking.id}-${Date.now()}.pdf`
    
    const uploadUrl = await generatePresignedUploadUrl(
      fileName,
      'application/pdf',
      3600
    )

    // Upload PDF to S3
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: new Uint8Array(pdfBytes),
      headers: {
        'Content-Type': 'application/pdf',
      },
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload PDF to S3')
    }

    const pdfUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`

    // Create or update contract record
    const contract = await prisma.contract.upsert({
      where: { bookingId: booking.id },
      update: {
        pdfUrl,
        generatedAt: new Date(),
      },
      create: {
        bookingId: booking.id,
        pdfUrl,
        generatedAt: new Date(),
      }
    })

    // Log admin action
    await prisma.action.create({
      data: {
        userId: session.user.id,
        type: 'CONTRACT_GENERATED',
        payload: {
          bookingId: booking.id,
          contractId: contract.id,
        }
      }
    })

    return NextResponse.json({
      contractId: contract.id,
      pdfUrl,
      message: 'Contrato generado correctamente'
    })

  } catch (error) {
    console.error('Error generating contract:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
