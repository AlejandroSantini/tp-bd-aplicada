#!/bin/bash

echo "🚀 Iniciando Dashboard de Rendimiento Académico..."

# Verificar si PostgreSQL está ejecutándose
if ! pgrep -x "postgres" > /dev/null; then
    echo "⚠️  PostgreSQL no está ejecutándose. Iniciando..."
    brew services start postgresql@15
    sleep 3
fi

echo "✅ PostgreSQL está ejecutándose"

# Iniciar la aplicación
echo "🌐 Iniciando servidor web..."
npm start
