import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className={cn(
        'flex-grow',
        !isLandingPage && 'pt-16 sm:pt-20',
        'transition-all duration-300'
      )}>
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;