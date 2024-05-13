import { ContextProvider } from './context/context'
import Navbar from '@/app/components/header/navbar'
import Footer from '@/app/components/footer/footer'
import RootStyleRegistry from '@/app/components/RootStyleRegistry'
import './globals.scss'
import 'antd/dist/reset.css';
export const metadata = {
  title: '',
  description: '',
}

export default async function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <title>GlobalFindr</title>
      </head>
      <body id='body' className="App bg-secondary">
        <ContextProvider>
          <Navbar />
            <RootStyleRegistry>{children}</RootStyleRegistry>
          <Footer />
        </ContextProvider>
      </body>
    </html>
  )
}
