import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] py-16">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
        <AlertTriangle size={36} className="text-neutral-500" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3 text-center">
        Página no encontrada
      </h1>
      
      <p className="text-lg text-neutral-600 mb-8 text-center max-w-md">
        La página que estás buscando no existe o ha sido movida a otra ubicación.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => window.history.back()}>
          Volver Atrás
        </Button>
        
        <Link to="/">
          <Button variant="outline">
            Ir al Inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;