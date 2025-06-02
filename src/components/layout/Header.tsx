import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useWalletStore } from '../../stores/walletStore';
import ConnectWalletButton from '../wallet/ConnectWalletButton';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { cn } from '../../lib/utils';
import { CoinsIcon } from '../ui/Icons';

const Header: React.FC = () => {
  const { isConnected } = useWalletStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Add scroll event listener to change header appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation links - change based on auth status
  const navigationLinks = isConnected
    ? [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Explorar', href: '/explore' },
        { name: 'Crear Pasanaku', href: '/create' },
        { name: 'Mi Perfil', href: '/profile' },
      ]
    : [
        { name: 'Inicio', href: '/' },
        { name: 'Cómo Funciona', href: '/#how-it-works' },
        { name: 'Preguntas Frecuentes', href: '/#faq' },
      ];

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-sm backdrop-blur-sm',
        isScrolled || isConnected || location.pathname !== '/' 
          ? 'bg-white/90' 
          : 'bg-transparent/0'
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <CoinsIcon className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-neutral-900">Pasacoin</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  location.pathname === link.href
                    ? 'text-primary-600'
                    : 'text-neutral-600 hover:text-neutral-900'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Right section with auth/notifications */}
          <div className="flex items-center space-x-4">
            {/* Notification bell for authenticated users */}
            {isConnected && <NotificationDropdown />}
            
            {/* Connect wallet button or user menu */}
            <ConnectWalletButton />
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-sm border-t border-neutral-200 shadow-lg animate-fade">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium',
                  location.pathname === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;