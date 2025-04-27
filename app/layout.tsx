import React from 'react';
import '@/app/globals.css';
import { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import SessionProviderClient from '@/app/dashboard/SessionProviderClient';
import { Analytics } from '@vercel/analytics/react'; // Vercel Analytics
import { SpeedInsights } from '@vercel/speed-insights/next'; // Vercel Speed Insights
import { GoogleAnalytics } from '@next/third-parties/google'; // Importar Google Analytics

// Configuración del Viewport
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

// Configuración de Metadatos (SEO, Social Sharing, etc.)
export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard | @referenciales.cl',
    default: 'referenciales.cl',
  },
  description: 'Base de datos colaborativa.',
  metadataBase: new URL('https://next14-postgres.vercel.app/'), // Reemplaza con tu URL de producción
  applicationName: 'referenciales.cl',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'referenciales.cl',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  authors: [{ name: 'referenciales.cl', url: 'https://www.referenciales.cl/' }], // Reemplaza con tu URL
  creator: 'referenciales.cl',
  publisher: 'referenciales.cl',
  keywords: ['Next.js 15', 'referenciales.cl', 'Dashboard', 'nextjs.org/learn', 'Server Actions', 'tasaciones', 'inmobiliarias', 'Chile'],
  icons: {
    icon: [
      { url: '/images/android/android-launchericon-512-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/images/android/android-launchericon-192-192.png', sizes: '192x192', type: 'image/png' },
      // ... otros tamaños si los tienes ...
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' } // Fallback favicon.ico
    ],
    apple: [
      { url: '/images/ios/180.png', sizes: '180x180', type: 'image/png' },
      // ... otros tamaños si los tienes ...
    ],
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: '/images/safari-pinned-tab.svg', // Asegúrate de que exista
        color: '#000000',
      },
    ],
  },
  manifest: '/manifest.json', // Asegúrate de que exista y esté configurado
  openGraph: {
    title: 'referenciales.cl Dashboard',
    description: 'Base de datos colaborativa.',
    url: 'https://next14-postgres.vercel.app/', // Reemplaza con tu URL de producción
    siteName: 'referenciales.cl',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png', // Asegúrate de que exista
        width: 1200,
        height: 630,
        alt: 'referenciales.cl Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tu_twitter', // Reemplaza con tu handle de Twitter si tienes
    description: 'Base de datos colaborativa.',
    title: 'referenciales.cl Dashboard',
    creator: '@tu_twitter', // Reemplaza con tu handle de Twitter si tienes
    images: ['/images/twitter-image.png'], // Asegúrate de que exista
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification', // Reemplaza con tu código de verificación de Google Search Console
  },
  alternates: {
    canonical: 'https://next14-postgres.vercel.app/', // Reemplaza con tu URL de producción
  },
};

// Componente RootLayout Principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lee el ID de Google Analytics desde las variables de entorno
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="es" suppressHydrationWarning={true}>
      {/* Next.js maneja la etiqueta <head> automáticamente con los metadatos exportados */}
      <body className="antialiased"> {/* Aplica estilos base o fuentes aquí si es necesario */}
        <SessionProviderClient> {/* Proveedor para NextAuth.js */}
          {children} {/* Contenido de la página actual */}

          {/* Componente para mostrar notificaciones (react-hot-toast) */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                duration: 3000,
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />

          {/* Componente de Vercel Analytics */}
          <Analytics />

          {/* Componente de Vercel Speed Insights */}
          <SpeedInsights />

          {/* Componente de Google Analytics 4 */}
          {/* Se renderiza solo si la variable de entorno NEXT_PUBLIC_GA_ID está definida */}
          {gaId && <GoogleAnalytics gaId={gaId} />}

        </SessionProviderClient>
      </body>
    </html>
  );
}
