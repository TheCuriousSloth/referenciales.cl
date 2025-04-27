/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'referenciales.cl',
      }
    ],
  },
  reactStrictMode: true,
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    // Asegúrate de que NEXT_PUBLIC_GA_ID esté disponible aquí si lo usas en el layout
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
  experimental: {
    optimizeCss: true,
    // Previene errores de hidratación
    scrollRestoration: false, // Cambia a false para probar
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    // Dominios base permitidos
    const baseDomains = [
      "'self'", // Permite scripts del mismo origen
      "https://*.vercel.com",
      "https://*.vercel-scripts.com",
      "https://va.vercel-scripts.com",
      "https://vitals.vercel-insights.com",
      "https://*.openstreetmap.org",
      "https://accounts.google.com"
    ];

    // --- *** AÑADIDO: Dominio para Google Analytics *** ---
    const googleAnalyticsDomain = "https://www.googletagmanager.com";
    // ----------------------------------------------------

    // Definición de las directivas CSP
    const cspDirectives = {
      'default-src': ["'self'"], // Por defecto, solo permitir recursos del mismo origen
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Necesario para algunos scripts inline (evalúa si puedes eliminarlo)
        "'unsafe-eval'",   // Necesario para algunas librerías (evalúa si puedes eliminarlo)
        ...baseDomains,
        googleAnalyticsDomain // <-- Añadido aquí
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'" // Permite estilos inline
      ],
      'img-src': [
        "'self'",
        "data:", // Permite imágenes data URI
        "blob:", // Permite imágenes blob URI
        "https://*.googleusercontent.com", // Para imágenes de Google (ej. avatares)
        "https://authjs.dev", // Si usas NextAuth/Auth.js
        "https://*.openstreetmap.org",
        "https://*.tile.openstreetmap.org", // Para tiles de mapas
        ...baseDomains
      ],
      'font-src': [
        "'self'",
        "data:" // Permite fuentes data URI
      ],
      'connect-src': [ // Para conexiones (fetch, XHR, WebSocket)
        "'self'",
        "https://*.tile.openstreetmap.org",
        "https://*.openstreetmap.org",
        googleAnalyticsDomain, // <-- Google Analytics también necesita conectarse
        ...baseDomains,
        ...(isDev ? ["*"] : []) // En desarrollo, permite conectar a cualquier sitio (*)
      ],
      'frame-src': [ // Para iframes
        "'self'",
        "https://accounts.google.com" // Para Google Sign-In
      ],
      // Define otras directivas según necesites (ej. 'media-src', 'object-src')
      'object-src': ["'none'"], // No permitir plugins como Flash
      'base-uri': ["'self'"], // Restringe las URLs base
      'form-action': ["'self'"], // Restringe a dónde pueden enviar formularios
      'frame-ancestors': ["'none'"], // Evita que tu sitio sea embebido en iframes (clickjacking)
    };

    // Construye la cadena CSP final
    const cspString = Object.entries(cspDirectives)
      .map(([key, values]) => `${key} ${Array.from(new Set(values)).join(' ')}`) // Usa Set para evitar duplicados
      .join('; ');

      // Define las cabeceras a retornar
      return [
        {
          source: '/:path*', // Aplica a todas las rutas
          headers: [
            { key: 'Content-Security-Policy', value: cspString.replace(/\s{2,}/g, ' ').trim() }, // Limpia espacios extra
            { key: 'X-Content-Type-Options', value: 'nosniff' }, // Evita que el navegador adivine tipos MIME
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // Previene clickjacking (alternativa a frame-ancestors)
            { key: 'Referrer-Policy', value: 'origin-when-cross-origin' }, // Controla qué información de referrer se envía
            { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }, // Fuerza HTTPS
            // Considera añadir 'Permissions-Policy' para controlar APIs del navegador
            // { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ],
        },
        // Puedes mantener tus otras configuraciones de cabeceras específicas
        {
          source: '/dashboard/referenciales',
          headers: [
            { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
          ],
        },
        {
          source: '/_next/static/:path*',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
      ];
    },
  };

module.exports = nextConfig;
