import * as React from 'react'
import Header from '../Header'
import Footer from '../Footer'

interface UserLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

const UserLayout: React.FC<UserLayoutProps> = ({ 
  children, 
  showHeader = true, 
  showFooter = true 
}) => {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {showHeader && <Header />}
      
      <div className="flex-1">
        {children}
      </div>
      
      {showFooter && <Footer />}
    </main>
  )
}

export default UserLayout
