import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';



import { getSettings } from "@/actions/settings"

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata() {
  const settings = await getSettings()

  return {
    title: settings['site_name'] || 'MTsN 1 Pacitan - Madrasah Hebat Bermartabat',
    description: settings['site_description'] || 'Website Resmi MTsN 1 Pacitan',
    icons: {
      icon: settings['site_logo'] || '/favicon.ico',
      apple: settings['site_logo'] || '/favicon.ico',
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

