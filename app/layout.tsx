'use client'

import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'react-hot-toast'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Nexfloor - Sistema de Monitoramento de Integridade</title>
        <meta name="description" content="Plataforma integrada para monitoramento da integridade física e manutenção preventiva de pisos industriais com blocos inteligentes" />
        <meta name="generator" content="Next.js" />
        <link rel="icon" href="/logo-nexfloor.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo-nexfloor.png" />
      </head>
      <body className={`font-sans antialiased`}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            
            <SidebarInset className="flex-1">
              {/* Trigger do Sidebar para Mobile */}
              <div className="md:hidden px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-10">
                <SidebarTrigger />
              </div>
              
              {children}
            </SidebarInset>
          </div>
        </SidebarProvider>
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#fff',
              color: '#000',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
