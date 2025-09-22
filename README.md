# Violiva Web - Música para Bodas

Una aplicación web completa para gestionar servicios de música en vivo para bodas, construida con Next.js 14, TypeScript, Prisma y PostgreSQL.

## 🎵 Características

### Público
- **Catálogo de canciones** con reproductor de audio protegido (HLS)
- **Configurador de bodas** paso a paso
- **Selección de packs** (Básico, Estándar, Premium)
- **Calendario de disponibilidad**
- **Formulario de contacto**

### Panel de Administración
- **Gestión de reservas** y clientes
- **Generación de contratos PDF** automática
- **Sincronización con Google Calendar**
- **Seguimiento de estados** (Contactado → Confirmado → Pagado → Realizado)
- **Gestión de canciones** y repertorio

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **Storage**: AWS S3 + CloudFront
- **PDF**: pdf-lib
- **Email**: Nodemailer
- **Deploy**: Vercel / Docker

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL
- AWS S3 bucket
- CloudFront distribution

### 1. Clonar el repositorio
\`\`\`bash
git clone <repository-url>
cd violiva_web
\`\`\`

### 2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### 3. Configurar variables de entorno
Copia \`env.example\` a \`.env.local\` y configura:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/violiva_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="eu-west-1"
AWS_S3_BUCKET="violiva-audio-files"

# CloudFront
CLOUDFRONT_DOMAIN="d1234567890.cloudfront.net"
CLOUDFRONT_KEY_PAIR_ID="your-key-pair-id"
CLOUDFRONT_PRIVATE_KEY="your-private-key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
\`\`\`

### 4. Configurar base de datos
\`\`\`bash
# Generar cliente Prisma
npm run db:generate

# Ejecutar migraciones
npm run db:migrate

# Poblar con datos de ejemplo
npm run db:seed
\`\`\`

### 5. Ejecutar en desarrollo
\`\`\`bash
npm run dev
\`\`\`

## 📁 Estructura del Proyecto

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── admin/             # Panel de administración
│   ├── escuchar/          # Catálogo de canciones
│   ├── configura/         # Configurador de bodas
│   └── ...
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── AudioPlayer.tsx   # Reproductor de audio
│   ├── ConfiguratorWizard.tsx
│   └── ...
├── lib/                  # Utilidades y configuración
│   ├── prisma.ts         # Cliente Prisma
│   ├── auth.ts           # Configuración NextAuth
│   ├── aws.ts            # Configuración AWS
│   └── validations.ts    # Esquemas Zod
└── prisma/
    ├── schema.prisma     # Esquema de base de datos
    └── seed.ts           # Datos de ejemplo
\`\`\`

## 🎯 Funcionalidades Principales

### Reproductor de Audio Protegido
- Streaming HLS con URLs firmadas
- Protección contra descarga directa
- Reproductor personalizado con controles

### Configurador de Bodas
1. **Selección de pack** (3, 5 o 7 canciones)
2. **Elección de canciones** del catálogo
3. **Canciones personalizadas** (opcional)
4. **Datos del cliente** y evento

### Panel de Administración
- **Dashboard** con estadísticas
- **Lista de reservas** con filtros
- **Gestión de estados** de reservas
- **Generación de contratos PDF**
- **Envío de emails** automático

### Generación de PDFs
- **Contratos personalizados** con datos del cliente
- **Plantillas profesionales** con términos y condiciones
- **Almacenamiento en S3** con URLs firmadas
- **Envío automático** por email

## 🔒 Seguridad

- **Autenticación** con NextAuth.js
- **Validación** de datos con Zod
- **Rate limiting** en endpoints públicos
- **CORS** configurado
- **HTTPS** obligatorio en producción
- **Audit logs** para acciones administrativas

## 📊 Base de Datos

### Modelos principales:
- **User**: Administradores
- **Client**: Clientes
- **Booking**: Reservas
- **Song**: Canciones del repertorio
- **Selection**: Canciones seleccionadas
- **Contract**: Contratos generados
- **Action**: Log de acciones

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Deploy automático en push a main

### Docker
\`\`\`bash
# Construir imagen
docker build -t violiva-web .

# Ejecutar con docker-compose
docker-compose up -d
\`\`\`

### Variables de entorno requeridas:
- \`DATABASE_URL\`
- \`NEXTAUTH_SECRET\`
- \`AWS_ACCESS_KEY_ID\`
- \`AWS_SECRET_ACCESS_KEY\`
- \`AWS_S3_BUCKET\`
- \`CLOUDFRONT_DOMAIN\`

## 🧪 Testing

\`\`\`bash
# Ejecutar tests
npm test

# Tests con cobertura
npm run test:coverage

# Linting
npm run lint
\`\`\`

## 📈 Monitoreo

- **Sentry** para errores
- **Vercel Analytics** para métricas
- **Logs** estructurados
- **Health checks** en \`/api/health\`

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver \`LICENSE\` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- Email: admin@violiva.com
- GitHub Issues: [Crear issue](https://github.com/username/violiva-web/issues)

---

**Desarrollado con ❤️ para hacer de tu boda un momento único**