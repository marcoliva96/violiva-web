#!/bin/bash
# Vercel build script with Prisma support
echo "Building for Vercel with Prisma..."

# Set environment variables for build
export NODE_ENV=production
export DATABASE_URL=""

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run build
echo "Running Next.js build..."
npm run build