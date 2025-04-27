import React from 'react';
import '@/app/globals.css';
import { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import SessionProviderClient from '@/app/dashboard/SessionProviderClient';
import { Analytics } from '@vercel/analytics/react'; // Vercel Analytics
import { SpeedInsights } from '@vercel/speed-insights/next'; // Vercel Speed Insights
// --- *** 1. Importa el componente GoogleAnalytics *** ---
import { GoogleAnalytics } from '@next/third-parties/google';

// Define tu Viewport
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

// Define tu Metadata
export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard | @referenciales.cl',
    default: 'referenciales.cl',
  },
  description: 'Base de datos colaborativa.',
  metadataBase: new URL('https://referenciales.cl/'),
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
  authors: [{ name: 'referenciales.cl', url: 'https://www.referenciales.cl/' }],
  creator: 'referenciales.cl',
  publisher: 'referenciales.cl',
  keywords: ['Next.js 15', 'referenciales.cl', 'Dashboard', 'nextjs.org/learn', 'Server Actions'],
  icons: {
    icon: [
      { url: '/images/android/android-launchericon-512-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/images/android/android-launchericon-192-192.png', sizes: '192x192', type: 'image/png' },
      // ... otros iconos ...
      { url: '/images/android/android-launchericon-48-48.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/images/ios/180.png', sizes: '180x180', type: 'image/png' },
      // ... otros iconos apple ...
    ],
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'mask-icon',
        url: '/images/safari-pinned-tab.svg',
        color: '#000000',
      },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'referenciales.cl Dashboard',
    description: 'Base de datos colaborativa.',
    url: 'https://next14-postgres.vercel.app/', // Asegúrate que esta sea la URL correcta de tu sitio
    siteName: 'referenciales.cl',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'referenciales.cl Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@referenciales.cl', // Reemplaza si tienes cuenta de Twitter
    description: 'Base de datos colaborativa.',
    title: 'referenciales.cl Dashboard',
    creator: '@referenciales.cl', // Reemplaza si tienes cuenta de Twitter
    images: ['/images/twitter-image.png'],
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
    google: 'your-google-site-verification', // Reemplaza con tu código de verificación
  },
  alternates: {
    canonical: 'https://next14-postgres.vercel.app/', // Asegúrate que esta sea la URL correcta de tu sitio
  },
};

// --- Variable de Entorno para ID de Google Analytics (Recomendado) ---
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
// ---------------------------------------------------------------------

// The RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <SessionProviderClient>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              // ... tus estilos de toast ...
            }}
          />
          <Analytics /> {/* Vercel Analytics */}
          <SpeedInsights /> {/* Vercel Speed Insights */}

          {/* --- 2. Añade el componente GoogleAnalytics --- */}
          {/* Se renderiza solo si el ID existe (recomendado con variable de entorno) */}
          {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
          {/* Alternativa si NO usas variables de entorno (menos recomendado): */}
          {/* <GoogleAnalytics gaId="G-0PZ4KK793T" /> */}

        </SessionProviderClient>
      </body>
    </html>
  );
}
