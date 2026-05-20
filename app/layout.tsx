import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Silver 6 — eCommerce Store',
  description: 'Shop the best products.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased text-gray-900 bg-white min-h-screen flex flex-col">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
