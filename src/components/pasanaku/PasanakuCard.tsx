import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Clock } from 'lucide-react';
import { Pasanaku } from '../../stores/pasanakuStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { cn, formatCurrency, formatAddress } from '../../lib/utils';

interface PasanakuCardProps {
  pasanaku: Pasanaku;
  variant?: 'default' | 'compact';
  className?: string;
  showJoinButton?: boolean;
  onJoin?: () => void;
}

const PasanakuCard: React.FC<PasanakuCardProps> = ({ 
  pasanaku, 
  variant = 'default',
  className,
  showJoinButton = false,
  onJoin
}) => {
  const isCompact = variant === 'compact';

  // Helper to format frequency
  const formatFrequency = (freq: string) => {
    switch (freq) {
      case 'weekly': return 'Semanal';
      case 'biweekly': return 'Quincenal';
      case 'monthly': return 'Mensual';
      default: return freq;
    }
  };
  
  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open': return 'bg-success-100 text-success-700';
      case 'active': return 'bg-primary-100 text-primary-700';
      case 'completed': return 'bg-neutral-100 text-neutral-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };
  
  // Format status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Abierto';
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      'hover:scale-[1.02] active:scale-[0.98]',
      className
    )}>
      <Card.Header className={cn(isCompact ? 'p-4' : 'p-6')}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <Card.Title className={cn(isCompact ? 'text-lg' : 'text-xl')}>
                {pasanaku.name}
              </Card.Title>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium',
                getStatusBadgeClass(pasanaku.status)
              )}>
                {getStatusLabel(pasanaku.status)}
              </span>
            </div>
            
            <Card.Description>
              Creado por {formatAddress(pasanaku.creatorAddress)}
            </Card.Description>
          </div>
          
          {/* Current pot or contribution amount */}
          <div className="text-right">
            <span className="text-xs uppercase font-semibold text-neutral-500">
              {pasanaku.status === 'active' ? 'Pozo Actual' : 'Cuota'}
            </span>
            <p className="text-lg font-semibold text-accent-600">
              {pasanaku.status === 'active' 
                ? formatCurrency(pasanaku.currentPot) 
                : formatCurrency(pasanaku.contributionAmount)}
            </p>
          </div>
        </div>
      </Card.Header>
      
      <Card.Content className={cn(isCompact ? 'p-4' : 'p-6')}>
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Users size={isCompact ? 16 : 18} className="text-neutral-500 mr-2" />
            <div>
              <p className="text-sm font-medium">Participantes</p>
              <p className="text-neutral-600">{pasanaku.participants.length}/{pasanaku.totalContributions}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar size={isCompact ? 16 : 18} className="text-neutral-500 mr-2" />
            <div>
              <p className="text-sm font-medium">Frecuencia</p>
              <p className="text-neutral-600">{formatFrequency(pasanaku.frequency)}</p>
            </div>
          </div>
        </div>
        
        {/* Progress or next payment */}
        {pasanaku.status === 'active' && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-sm mb-1">
              <span>Progreso del ciclo</span>
              <span className="font-medium">{pasanaku.currentCycle}/{pasanaku.maxCycles}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full"
                style={{ width: `${(pasanaku.currentCycle / pasanaku.maxCycles) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Next payment due */}
        {pasanaku.nextPaymentDue && (
          <div className="flex items-center text-sm text-neutral-600">
            <Clock size={16} className="mr-1" />
            <span>
              {new Date(pasanaku.nextPaymentDue).toLocaleDateString('es-BO', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        )}
      </Card.Content>
      
      <Card.Footer className={cn(isCompact ? 'p-4 pt-0' : 'p-6 pt-0')}>
        <div className="flex justify-end">
          {showJoinButton ? (
            <Button 
              variant="primary" 
              onClick={onJoin}
              size={isCompact ? 'sm' : 'md'}
              className="w-full sm:w-auto"
            >
              Unirme
            </Button>
          ) : (
            <Link to={`/pasanaku/${pasanaku.id}`}>
              <Button 
                variant="outline" 
                size={isCompact ? 'sm' : 'md'}
                className="w-full sm:w-auto"
              >
                Ver Detalles
              </Button>
            </Link>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default PasanakuCard;