@echo off
echo Limpiando archivos cache...
rmdir /s /q .next
rmdir /s /q node_modules\.cache
echo Cache limpiada. Reinstalando dependencias...
call npm ci
echo Generando Prisma client...
call npx prisma generate
echo Construyendo proyecto...
call npm run build
echo Proceso completado. Intentar iniciar con:
echo npm run dev --turbo