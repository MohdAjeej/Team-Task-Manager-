#!/usr/bin/env bash
# Render build script

set -o errexit

echo "Installing dependencies..."
npm install

echo "Generating Prisma Client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "Build complete!"
