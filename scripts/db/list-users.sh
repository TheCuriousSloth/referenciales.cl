#!/bin/bash
# scripts/db/list-users.sh

echo "🚀 Iniciando script de consulta de usuarios..."

# Función para confirmar acciones
confirm() {
    read -p "❓ $1 (s/N): " response
    case "$response" in
        [sS]*) return 0 ;;
        *) return 1 ;;
    esac
}

# Verificar si hay cambios pendientes en la base de datos
if npx prisma db pull --print > /dev/null 2>&1; then
    if [ $? -ne 0 ]; then
        echo "⚠️  Se detectaron cambios pendientes en la base de datos"
        if ! confirm "¿Desea continuar?"; then
            echo "❌ Operación cancelada por el usuario"
            exit 1
        fi
    fi
fi

# Verificar si la base de datos está activa
echo "🔍 Verificando estado de la base de datos..."
if ! npx prisma studio --browser none & sleep 2; then
    echo "⚠️  Base de datos no detectada"
    if ! confirm "¿Desea iniciar la base de datos?"; then
        echo "❌ Operación cancelada por el usuario"
        exit 1
    fi
    npx prisma generate
    npx prisma db push --preview-feature
fi

# Crear archivo temporal de consulta
echo "📝 Preparando consulta..."
echo "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (users.length === 0) {
      console.log('⚠️  No se encontraron usuarios');
      return;
    }

    console.log('\n📋 Lista de usuarios:');
    console.log('============================================');
    users.forEach(user => {
      console.log(\`🔹 ID: \${user.id}\`);
      console.log(\`📧 Email: \${user.email}\`);
      console.log(\`👤 Nombre: \${user.name || 'No especificado'}\`);
      console.log(\`👑 Rol: \${user.role || 'user'}\`);
      console.log(\`✅ Email Verificado: \${user.emailVerified ? 'Sí' : 'No'}\`);
      console.log('============================================');
    });
    
    console.log(\`\n✨ Total usuarios: \${users.length}\n\`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.\$disconnect();
  }
}

listUsers();
" > temp-list-users.js

# Ejecutar consulta con manejo de errores
echo "🔍 Consultando usuarios..."
if ! node temp-list-users.js; then
    echo "❌ Error al ejecutar la consulta"
    rm temp-list-users.js
    pkill -f "prisma studio"
    exit 1
fi

# Limpiar recursos temporales de forma segura
echo "🧹 Limpiando recursos..."
if [ -f temp-list-users.js ]; then
    rm temp-list-users.js
fi

if pgrep -f "prisma studio" > /dev/null; then
    pkill -f "prisma studio"
fi

echo "✅ Consulta finalizada exitosamente!"