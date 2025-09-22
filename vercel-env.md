# Variables de entorno para Vercel

## Variables necesarias en Vercel:

### Base de datos
- `DATABASE_URL`: URL de conexión a PostgreSQL (Vercel Postgres)

### NextAuth
- `NEXTAUTH_SECRET`: Clave secreta para autenticación
- `NEXTAUTH_URL`: URL de tu dominio

### Email
- `EMAIL_HOST`: smtp.gmail.com
- `EMAIL_PORT`: 587
- `EMAIL_USER`: tu-email@gmail.com
- `EMAIL_PASS`: tu-contraseña-de-aplicación

### AWS (opcional)
- `AWS_ACCESS_KEY_ID`: Tu clave de acceso AWS
- `AWS_SECRET_ACCESS_KEY`: Tu clave secreta AWS
- `AWS_REGION`: us-east-1
- `AWS_S3_BUCKET`: nombre-de-tu-bucket
- `AWS_CLOUDFRONT_DOMAIN`: tu-dominio-cloudfront
