import { z } from 'zod'

// Client validation schemas
export const clientSchema = z.object({
  firstName: z.string().min(1, 'Nombre es requerido'),
  lastName: z.string().min(1, 'Apellido es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  partnerName: z.string().optional(),
})

export const bookingSchema = z.object({
  client: clientSchema,
  weddingDate: z.string().optional(),
  venue: z.string().optional(), // Deprecated, mantener para compatibilidad
  ceremonyVenue: z.string().optional(),
  cocktailVenue: z.string().optional(),
  pack: z.enum(['CEREMONIA', 'APERITIVO_1H', 'APERITIVO_1_5H', 'CEREMONIA_APERITIVO_1H', 'CEREMONIA_APERITIVO_1_5H']),
  ceremonyMoments: z.array(z.string()).optional(),
  ceremonySongs: z.record(z.string()).optional(),
  cocktailStyles: z.array(z.string()).optional(),
  cocktailComment: z.string().optional(),
  customSongs: z.array(z.object({
    title: z.string(),
    url: z.string().optional(),
  })).optional(),
  firstPersonName: z.string().optional(),
  secondPersonName: z.string().optional(),
  languagePreference: z.string().optional(),
})

// Song validation schemas
export const songSchema = z.object({
  title: z.string().min(1, 'Título es requerido'),
  composer: z.string().optional(),
  genre: z.string().optional(),
  durationSec: z.number().positive().optional(),
  isFeatured: z.boolean().default(false),
})

// Admin booking update schema
export const bookingUpdateSchema = z.object({
  state: z.enum(['PENDING', 'CONFIRMED', 'PAID', 'COMPLETED', 'CANCELLED']).optional(),
  priceCents: z.number().positive().optional(),
  finalPrice: z.number().positive().optional(),
  visible: z.boolean().optional(),
  notes: z.string().optional(),
})

// Contact form schema
export const contactSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Mensaje debe tener al menos 10 caracteres'),
})
