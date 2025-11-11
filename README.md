# Dashboard de Rendimiento Académico

Sistema de visualización de rendimiento académico con indicadores de semáforo y drill-down por niveles (Facultad → Carrera).

## 📋 Características

- **Autenticación**: Login con usuarios y contraseñas codificadas en Base64
- **Visualización por niveles**:
  - Nivel 1: Promedio general por Facultad
  - Nivel 2: Promedio por Carrera (drill-down desde Facultad)
- **Indicadores de semáforo**: Tasa de aprobación con 3 niveles
  - 🟢 Verde: > 75%
  - 🟡 Amarillo: 50-75%
  - 🔴 Rojo: < 50%
- **Gráficos interactivos**: Barras con colores según promedio
  - Azul: Promedio ≥ 8
  - Amarillo: Promedio ≥ 6
  - Rojo: Promedio < 6

## 🛠️ Tecnologías

- **Backend**: Node.js con Express.js
- **Base de datos**: PostgreSQL 15
- **Frontend**: EJS (templates), Chart.js (gráficos)
- **Sesiones**: express-session
- **Autenticación**: Base64 encoding

## 📦 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar PostgreSQL

Asegúrate de que PostgreSQL esté instalado y corriendo:
```bash
brew services list
```

Si no está corriendo:
```bash
brew services start postgresql@15
```

### 3. Configurar la base de datos

El proyecto incluye un script de configuración automática:
```bash
./setup-db.sh
```

Este script:
- Crea la base de datos `rendimiento_academico`
- Crea todas las tablas necesarias
- Carga datos de ejemplo

### 4. Variables de entorno

El archivo `.env` ya está configurado con:
```properties
DB_HOST=localhost
DB_PORT=5432
DB_USER=alejandosantini
DB_PASSWORD=
DB_NAME=rendimiento_academico
SESSION_SECRET=mi_clave_secreta_super_segura_123456789
```

## 🚀 Uso

### Iniciar el servidor

```bash
npm start
```

El servidor estará disponible en: http://localhost:3000

### Usuarios de prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | Administrador |
| secretario | secret123 | Secretario |
| coordinador | coord123 | Coordinador |

### Navegación

1. **Login**: Ingresa con uno de los usuarios de prueba
2. **Dashboard Principal**: Muestra el promedio por Facultad
   - Haz clic en cualquier barra del gráfico para hacer drill-down
3. **Vista de Carrera**: Muestra el promedio por Carrera de la Facultad seleccionada
   - Usa el botón "← Volver a Facultades" para regresar

## 📊 Estructura de la Base de Datos

```
Usuario
├── id (SERIAL)
├── nombre (VARCHAR)
└── password (VARCHAR) -- Base64 encoded

Facultad
├── id (SERIAL)
└── nombre_facultad (VARCHAR)

Carrera
├── id (SERIAL)
├── nombre_carrera (VARCHAR)
└── id_facultad (FK → Facultad)

Materia
├── id (SERIAL)
├── nombre_materia (VARCHAR)
└── id_carrera (FK → Carrera)

Alumno
├── id (SERIAL)
├── nombre_completo (VARCHAR)
└── legajo (VARCHAR)

Inscripcion
├── id (SERIAL)
├── id_alumno (FK → Alumno)
├── id_materia (FK → Materia)
├── nota_final (INTEGER)
├── fecha_cursado (DATE)
└── estado (VARCHAR)
```

## 📁 Estructura del Proyecto

```
Proyecto BD/
├── database/
│   ├── schema_postgres.sql      # Definición de tablas
│   └── sample_data_postgres.sql # Datos de ejemplo
├── public/
│   ├── css/
│   │   └── style.css           # Estilos CSS
│   └── js/
│       └── dashboard-charts.js # Lógica de Chart.js
├── routes/
│   └── mainRoutes.js           # Rutas de la aplicación
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── login.ejs              # Vista de login
│   └── dashboard.ejs          # Vista del dashboard
├── database.js                # Configuración de PostgreSQL
├── server.js                  # Servidor Express
├── .env                       # Variables de entorno
├── setup-db.sh               # Script de configuración DB
└── package.json              # Dependencias npm
```

## 🔍 Consultas SQL Principales

### Promedio por Facultad
```sql
SELECT 
    f.id, 
    f.nombre_facultad, 
    ROUND(AVG(i.nota_final::numeric), 1) as promedio
FROM Facultad f
LEFT JOIN Carrera c ON f.id = c.id_facultad
LEFT JOIN Materia m ON c.id = m.id_carrera
LEFT JOIN Inscripcion i ON m.id = i.id_materia
WHERE i.nota_final IS NOT NULL
GROUP BY f.id, f.nombre_facultad
ORDER BY promedio DESC
```

### Tasa de Aprobación
```sql
SELECT 
    ROUND(
        (COUNT(*) FILTER (WHERE nota_final >= 6)::numeric / COUNT(*)::numeric) * 100, 
        1
    ) as tasa_aprobacion
FROM Inscripcion
WHERE nota_final IS NOT NULL
```

## 🎨 Personalización

### Cambiar colores del semáforo

Edita `/public/css/style.css`:
```css
.verde { background-color: #4CAF50; }
.amarillo { background-color: #FFC107; }
.rojo { background-color: #F44336; }
```

### Modificar umbrales del indicador

Edita `/routes/mainRoutes.js`:
```javascript
if (tasaAprobacionGlobal > 75) tasaAprobacionColor = 'verde';
else if (tasaAprobacionGlobal >= 50) tasaAprobacionColor = 'amarillo';
else tasaAprobacionColor = 'rojo';
```

## 🐛 Troubleshooting

### Error: "role postgres does not exist"

Asegúrate de que `DB_USER` en `.env` sea tu usuario de macOS:
```properties
DB_USER=alejandosantini
```

### Puerto 3000 ya en uso

Cambia el puerto en `server.js` o mata el proceso:
```bash
lsof -ti:3000 | xargs kill -9
```

### Base de datos no existe

Ejecuta el script de setup:
```bash
./setup-db.sh
```

## 📝 Notas de Desarrollo

- Las contraseñas se codifican en Base64 (no es seguro para producción)
- Los datos de ejemplo se cargan automáticamente
- El sistema usa connection pooling de PostgreSQL (max 20 conexiones)
- Las sesiones expiran después de 1 hora

## 📄 Licencia

Proyecto académico - Universidad Abierta Interamericana
Dashboard - Bases de Datos Aplicadas
