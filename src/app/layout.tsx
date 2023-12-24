import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { WagmiProviders } from './WagmiProviders'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReduxProvider from '@/app/ReduxProvider'
import Toast from '@/components/Toast'


const inter = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SolidSafe',
  description: 'SolidSafe | The only stablecoin that you need',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <WagmiProviders>
          <ReduxProvider>
            <Toast />
            <Header />
            {children}
            <Footer />
          </ReduxProvider>
        </WagmiProviders>
      </body>
    </html>
  )
}
