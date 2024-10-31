// app/layout.tsx

import React from 'react';
import '@/app/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard | @referenciales.cl',
    default: 'referenciales.cl Dashboard',
  },
  description: 'Base de datos colaborativa.',
  metadataBase: new URL('https://next14-postgres.vercel.app/'),
  authors: [{ name: 'referenciales.cl', url: 'https://www.referenciales.cl/' }],
  keywords: ['Next.js 14', 'referenciales.cl', 'Dashboard', 'nextjs.org/learn', 'Server Actions'],
  openGraph: {
    title: 'referenciales.cl Dashboard',
    description: 'Base de datos colaborativa.',
    url: 'https://next14-postgres.vercel.app/',
    type: 'website',
  },
  twitter: {
    site: '@referenciales.cl',
    description: 'Base de datos colaborativa.',
    title: 'referenciales.cl Dashboard',
    creator: '@referenciales.cl',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Aquí puedes agregar otras etiquetas de enlace o meta si es necesario */}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}