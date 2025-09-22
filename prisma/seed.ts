import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@violiva.com' },
    update: {},
    create: {
      email: 'admin@violiva.com',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created:', admin.email)

  // Create sample songs
  const songs = [
    {
      title: 'Canon in D',
      composer: 'Johann Pachelbel',
      genre: 'Clásica',
      durationSec: 300,
      isFeatured: true,
      s3Key: 'songs/canon-in-d.mp3'
    },
    {
      title: 'Ave Maria',
      composer: 'Franz Schubert',
      genre: 'Clásica',
      durationSec: 240,
      isFeatured: true,
      s3Key: 'songs/ave-maria.mp3'
    },
    {
      title: 'All of Me',
      composer: 'John Legend',
      genre: 'Pop',
      durationSec: 270,
      isFeatured: true,
      s3Key: 'songs/all-of-me.mp3'
    },
    {
      title: 'Perfect',
      composer: 'Ed Sheeran',
      genre: 'Pop',
      durationSec: 260,
      isFeatured: true,
      s3Key: 'songs/perfect.mp3'
    },
    {
      title: 'Thinking Out Loud',
      composer: 'Ed Sheeran',
      genre: 'Pop',
      durationSec: 280,
      isFeatured: true,
      s3Key: 'songs/thinking-out-loud.mp3'
    },
    {
      title: 'At Last',
      composer: 'Etta James',
      genre: 'Jazz',
      durationSec: 190,
      isFeatured: false,
      s3Key: 'songs/at-last.mp3'
    },
    {
      title: 'La Vie En Rose',
      composer: 'Édith Piaf',
      genre: 'Jazz',
      durationSec: 200,
      isFeatured: false,
      s3Key: 'songs/la-vie-en-rose.mp3'
    },
    {
      title: 'Fly Me to the Moon',
      composer: 'Frank Sinatra',
      genre: 'Jazz',
      durationSec: 150,
      isFeatured: false,
      s3Key: 'songs/fly-me-to-the-moon.mp3'
    },
    {
      title: 'Hallelujah',
      composer: 'Leonard Cohen',
      genre: 'Folk',
      durationSec: 300,
      isFeatured: false,
      s3Key: 'songs/hallelujah.mp3'
    },
    {
      title: 'Make You Feel My Love',
      composer: 'Bob Dylan',
      genre: 'Folk',
      durationSec: 240,
      isFeatured: false,
      s3Key: 'songs/make-you-feel-my-love.mp3'
    }
  ]

  for (const song of songs) {
    await prisma.song.upsert({
      where: { 
        id: song.s3Key.replace('songs/', '').replace('.mp3', '')
      },
      update: {},
      create: {
        ...song,
        id: song.s3Key.replace('songs/', '').replace('.mp3', '')
      },
    })
  }

  console.log('Songs created:', songs.length)

  // Create sample clients and bookings
  const client1 = await prisma.client.upsert({
    where: { email: 'maria.garcia@example.com' },
    update: {},
    create: {
      firstName: 'María',
      lastName: 'García',
      email: 'maria.garcia@example.com',
      phone: '+34 600 000 001',
      partnerName: 'Carlos López',
      weddingDate: new Date('2024-06-15T16:00:00Z'),
      status: 'CONFIRMED',
    },
  })

  const booking1 = await prisma.booking.create({
    data: {
      clientId: client1.id,
      date: new Date('2024-06-15T16:00:00Z'),
      venue: 'Masía El Olivar',
      pack: 'CEREMONIA_APERITIVO_1H',
      priceCents: 50000,
      state: 'CONFIRMED',
      source: 'web-form',
    },
  })

  // Create song selections for booking1
  const songIds = await prisma.song.findMany({
    where: { isFeatured: true },
    select: { id: true },
    take: 5,
  })

  for (let i = 0; i < songIds.length; i++) {
    await prisma.selection.create({
      data: {
        bookingId: booking1.id,
        songId: songIds[i].id,
        orderIndex: i,
      },
    })
  }

  console.log('Sample booking created:', booking1.id)

  // Create another sample booking
  const client2 = await prisma.client.upsert({
    where: { email: 'ana.martinez@example.com' },
    update: {},
    create: {
      firstName: 'Ana',
      lastName: 'Martínez',
      email: 'ana.martinez@example.com',
      phone: '+34 600 000 002',
      partnerName: 'David Ruiz',
      weddingDate: new Date('2024-07-20T17:00:00Z'),
      status: 'CONTACTED',
    },
  })

  const booking2 = await prisma.booking.create({
    data: {
      clientId: client2.id,
      date: new Date('2024-07-20T17:00:00Z'),
      venue: 'Hotel Palace Barcelona',
      pack: 'CEREMONIA_APERITIVO_1_5H',
      priceCents: 70000,
      state: 'PENDING',
      source: 'web-form',
    },
  })

  console.log('Sample booking created:', booking2.id)

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
