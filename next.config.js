/** @type {import('next').NextConfig} */
const nextConfig = {
  // Aquí pueden ir otras configuraciones que ya tengas (reactStrictMode, images, etc.)
  // ...

  // Configuración de Headers para añadir la CSP
  async headers() {
    // Define las directivas de la Política de Seguridad de Contenido (CSP)
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://vercel.live/ https://va.vercel-scripts.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' blob: data: https://*.googleusercontent.com https://*.tile.openstreetmap.org;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://vercel.live/ https://vitals.vercel-insights.com;
      block-all-mixed-content;
      upgrade-insecure-requests;
    `;
    /*
      Explicación de las directivas corregidas/añadidas:
      - img-src:
        - 'self': Permite imágenes del mismo origen.
        - blob:: Permite imágenes creadas como Blobs.
        - data:: Permite imágenes como Data URIs.
        - https://*.googleusercontent.com: Permite avatares de usuarios de Google.
        - https://*.tile.openstreetmap.org: Añadido para permitir las teselas de OpenStreetMap (usadas comúnmente por Leaflet).
      - ... (otras directivas explicadas anteriormente) ...
    */

    return [
      {
        // Aplica estos headers a todas las rutas de la aplicación
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Limpia espacios extra y saltos de línea de la cadena CSP
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
          // Otros Headers de Seguridad (Buenas prácticas)
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
