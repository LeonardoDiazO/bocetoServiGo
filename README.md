# ServiGo

Plataforma de gestión de servicios técnicos construida con Next.js 15, React 19 y Genkit (Google AI). Permite administrar órdenes de trabajo, técnicos, inventario y métricas operativas con soporte de inteligencia artificial.

---

## Requisitos previos

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Node.js | 18+ (recomendado v22) | `node --version` |
| npm | 9+ | `npm --version` |

---

## Instalación y despliegue local

### 1. Clonar o extraer el proyecto

```bash
# Si tienes el .tar.gz
tar -xzf proyecto_servigo.tar.gz
cd proyecto_servigo
```

### 2. Instalar dependencias

```bash
npm install
```

> **Importante:** este paso es obligatorio aunque la carpeta `node_modules` ya exista. El repositorio puede tener dependencias incompletas o binarios faltantes (como `next`). Si ves el error `"next" no se reconoce como un comando interno o externo`, ejecutar `npm install` lo resuelve.

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
GEMINI_API_KEY=tu_clave_aqui
```

Obtén tu clave de API de Google en [Google AI Studio](https://aistudio.google.com/app/apikey).

> **Seguridad:** nunca compartas ni subas el archivo `.env` a un repositorio público. Agrega `.env` a tu `.gitignore`.

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:9002**

---

## Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo con Turbopack en el puerto 9002 |
| `npm run build` | Build de produccion (requiere `NODE_ENV=production`) |
| `npm run start` | Servidor de produccion (ejecutar despues de `build`) |
| `npm run genkit:dev` | Servidor de desarrollo de Genkit para flujos de IA |
| `npm run genkit:watch` | Servidor de Genkit con recarga automatica al guardar |
| `npm run lint` | Linter con ESLint |
| `npm run typecheck` | Verificacion de tipos con TypeScript |

---

## Estructura del proyecto

```
proyecto_servigo/
├── src/
│   ├── app/                    # Rutas de Next.js (App Router)
│   │   ├── login/              # Pagina de autenticacion
│   │   ├── dashboard/          # Dashboard del administrador
│   │   ├── mis-ordenes/        # Ordenes de trabajo (vista admin)
│   │   ├── perfil/             # Perfil de usuario
│   │   └── tech/               # Seccion del tecnico
│   │       ├── escanear/       # Escaneo de ordenes
│   │       ├── mi-bodega/      # Inventario del tecnico
│   │       ├── mis-ordenes/    # Ordenes asignadas al tecnico
│   │       │   └── [id]/       # Detalle de orden especifica
│   │       └── perfil/         # Perfil del tecnico
│   ├── ai/                     # Configuracion e integracion de IA
│   │   ├── genkit.ts           # Inicializacion de Genkit con Gemini 2.5 Flash
│   │   ├── dev.ts              # Punto de entrada para servidor Genkit
│   │   └── flows/
│   │       └── ai-insight-generation-flow.ts  # Flujo de generacion de insights
│   ├── components/             # Componentes reutilizables de UI
│   ├── context/
│   │   └── auth-context.tsx    # Contexto global de autenticacion
│   ├── hooks/                  # Hooks personalizados de React
│   └── lib/                    # Utilidades y datos
│       ├── data.ts             # Datos y funciones de acceso
│       └── utils.ts            # Funciones de utilidad general
├── .env                        # Variables de entorno (no subir al repo)
├── next.config.ts              # Configuracion de Next.js
├── tailwind.config.ts          # Configuracion de Tailwind CSS
├── components.json             # Configuracion de shadcn/ui
└── apphosting.yaml             # Configuracion para Firebase App Hosting (nube)
```

---

## Stack tecnologico

| Categoria | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS + Radix UI (shadcn/ui) |
| IA | Google Genkit + Gemini 2.5 Flash |
| Formularios | React Hook Form + Zod |
| Graficos | Recharts |
| Iconos | Lucide React |
| Backend cloud | Firebase (App Hosting) |
| Lenguaje | TypeScript 5 |

---

## Rutas de la aplicacion

| Ruta | Descripcion | Rol |
|---|---|---|
| `/login` | Inicio de sesion | Todos |
| `/dashboard` | Centro de comando operativo | Admin |
| `/mis-ordenes` | Gestion de ordenes de trabajo | Admin |
| `/perfil` | Perfil del usuario administrador | Admin |
| `/tech` | Dashboard del tecnico | Tecnico |
| `/tech/mis-ordenes` | Ordenes asignadas al tecnico | Tecnico |
| `/tech/mis-ordenes/[id]` | Detalle de una orden especifica | Tecnico |
| `/tech/escanear` | Escaneo de ordenes | Tecnico |
| `/tech/mi-bodega` | Inventario del tecnico | Tecnico |
| `/tech/perfil` | Perfil del tecnico | Tecnico |

---

## Inteligencia artificial

El proyecto usa **Google Genkit** con el modelo **Gemini 2.5 Flash** para generar insights automaticos a partir de metricas operativas.

### Flujo principal: `aiInsightGenerationFlow`

Recibe una descripcion de metricas (texto o JSON) y retorna un resumen en lenguaje natural con:
- Observaciones clave
- Anomalias detectadas
- Tendencias futuras

Para explorar y probar los flujos de IA de forma visual:

```bash
npm run genkit:dev
```

Esto abre el panel de desarrollo de Genkit en **http://localhost:4000**.

---

## Despliegue en produccion (Firebase App Hosting)

El proyecto esta configurado para desplegarse en Firebase App Hosting a traves de `apphosting.yaml`.

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Autenticarse
firebase login

# Desplegar
firebase deploy
```

> Consulta la [documentacion de Firebase App Hosting](https://firebase.google.com/docs/app-hosting) para configuracion detallada.

---

## Notas de desarrollo

- El build de produccion ignora errores de TypeScript y ESLint (`ignoreBuildErrors: true`) — se recomienda revisar y corregir estos antes de un despliegue en produccion real.
- Las imagenes externas permitidas provienen de `placehold.co`, `images.unsplash.com` y `picsum.photos`.
- El servidor de desarrollo corre en el puerto `9002` (no el 3000 por defecto de Next.js).
