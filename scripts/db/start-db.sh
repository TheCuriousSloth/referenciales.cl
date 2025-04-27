#!/bin/bash
# start-db.sh

echo "🚀 Iniciando configuración de base de datos..."

# Crear archivo de migración SQL
echo "-- modify_fojas_column.sql
ALTER TABLE \"referenciales\" ALTER COLUMN \"fojas\" TYPE text USING fojas::text;" > migrate.sql

# Ejecutar migración
echo "📦 Ejecutando migración..."
npx prisma db execute --file ./migrate.sql

# Actualizar schema y generar cliente
echo "🔄 Actualizando schema..."
npx prisma generate

# Verificar cambios
echo "✅ Verificando cambios..."
npx prisma db pull

echo "✨ Proceso completado!"