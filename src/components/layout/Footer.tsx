import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { CoinsIcon } from '../ui/Icons';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="md:col-span-1 text-center md:text-left">
            <div className="flex items-center">
              <CoinsIcon className="h-8 w-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold">Pasacoin</span>
            </div>
            <p className="mt-4 text-neutral-400 text-sm">
              La primera plataforma de Pasanakus en blockchain con USDT. 
              Protege tus ahorros de la devaluación.
            </p>
          </div>
          
          {/* Navigation */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Navegar</h3>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Inicio</Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-white transition-colors">Cómo Funciona</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">Explorar Pasanakus</Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-white transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Recursos</h3>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="https://polkadot.network/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Acerca de Polkadot
                </a>
              </li>
              <li>
                <a href="https://tether.to/en/what-is-usdt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  ¿Qué es USDT?
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tutorial de Billeteras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Términos y Condiciones
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <a href="mailto:info@pasacoin.com" className="hover:text-white transition-colors">
                  info@pasacoin.com
                </a>
              </li>
              <li>
                <a href="https://t.me/pasacoin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Telegram: @pasacoin
                </a>
              </li>
            </ul>
            
            {/* Social icons */}
            <div className="mt-4 flex justify-center md:justify-start space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm text-center md:text-left">
            &copy; {currentYear} Pasacoin. Todos los derechos reservados.
          </p>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-center">
            <Link to="/privacy" className="text-neutral-500 hover:text-neutral-400 text-sm">
              Política de Privacidad
            </Link>
            <Link to="/terms" className="text-neutral-500 hover:text-neutral-400 text-sm">
              Términos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;