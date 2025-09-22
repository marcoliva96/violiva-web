#!/bin/bash
# Vercel build script
echo "Building for Vercel..."

# Set environment variables for build
export NODE_ENV=production
export DATABASE_URL=""

# Run build
npm run build
