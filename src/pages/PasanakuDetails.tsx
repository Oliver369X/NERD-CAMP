import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, Clock, Wallet, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { useWalletStore } from '../stores/walletStore';
import { usePasanakuStore, Transaction } from '../stores/pasanakuStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatAddress, formatCurrency } from '../lib/utils';

const PasanakuDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { address } = useWalletStore();
  const { selectedPasanaku, isLoading, fetchPasanakuDetails, contributeToPool, claimPayout } = usePasanakuStore();
  const [isContributing, setIsContributing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchPasanakuDetails(id);
    }
  }, [id, fetchPasanakuDetails]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }
  
  if (!selectedPasanaku) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Pasanaku no encontrado</h2>
        <p className="text-neutral-600 mb-6">
          El Pasanaku que buscas no existe o no tienes acceso a él.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Volver al Dashboard
        </Button>
      </div>
    );
  }
  
  // Helper to format frequency
  const formatFrequency = (freq: string) => {
    switch (freq) {
      case 'weekly': return 'Semanal';
      case 'biweekly': return 'Quincenal';
      case 'monthly': return 'Mensual';
      default: return freq;
    }
  };
  
  // Check if current user is the payout recipient
  const isPayoutRecipient = selectedPasanaku.currentPayoutAddress === address;
  
  // Check if current user has already paid
  const userParticipant = selectedPasanaku.participants.find(p => p.address === address);
  const hasPaid = userParticipant?.status === 'paid';
  
  // Check if all participants have paid
  const allPaid = selectedPasanaku.participants.every(p => p.status === 'paid');
  
  const handleContribute = async () => {
    setIsContributing(true);
    try {
      await contributeToPool(selectedPasanaku.id, selectedPasanaku.contributionAmount);
    } finally {
      setIsContributing(false);
    }
  };
  
  const handleClaim = async () => {
    setIsClaiming(true);
    try {
      await claimPayout(selectedPasanaku.id);
    } finally {
      setIsClaiming(false);
    }
  };

  // Format status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Abierto para unirse';
      case 'active': return 'Activo';
      case 'completed': return 'Completado';
      default: return status;
    }
  };
  
  // Get transaction icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'contribution':
        return <ArrowUp size={16} className="text-success-500" />;
      case 'payout':
        return <ArrowDown size={16} className="text-accent-500" />;
      case 'join':
        return <Users size={16} className="text-primary-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          ← Volver
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{selectedPasanaku.name}</h1>
            <p className="text-neutral-600">
              Creado por {formatAddress(selectedPasanaku.creatorAddress)}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${selectedPasanaku.status === 'open' ? 'bg-success-100 text-success-800' : 
                selectedPasanaku.status === 'active' ? 'bg-primary-100 text-primary-800' :
                'bg-neutral-100 text-neutral-800'}`}
            >
              {getStatusLabel(selectedPasanaku.status)}
            </span>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main details card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <Card.Header>
                <Card.Title>Detalles del Pasanaku</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-neutral-500">Cuota</p>
                    <p className="font-semibold text-accent-600">{formatCurrency(selectedPasanaku.contributionAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Frecuencia</p>
                    <p className="font-semibold">{formatFrequency(selectedPasanaku.frequency)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Ciclo</p>
                    <p className="font-semibold">{selectedPasanaku.currentCycle} de {selectedPasanaku.maxCycles}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Pozo Actual</p>
                    <p className="font-semibold text-accent-600">{formatCurrency(selectedPasanaku.currentPot)}</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-6">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Progreso del Pasanaku</span>
                    <span className="font-medium">{selectedPasanaku.currentCycle}/{selectedPasanaku.maxCycles}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${(selectedPasanaku.currentCycle / selectedPasanaku.maxCycles) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Next payment due */}
                {selectedPasanaku.nextPaymentDue && (
                  <div className="mt-4 flex items-center">
                    <Clock size={16} className="text-neutral-500 mr-2" />
                    <span className="text-sm text-neutral-600">
                      Próximo pago: {new Date(selectedPasanaku.nextPaymentDue).toLocaleDateString('es-BO', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )}
              </Card.Content>
            </Card>
          </motion.div>
          
          {/* Participants card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <Card.Header>
                <Card.Title>Participantes</Card.Title>
                <Card.Description>
                  {selectedPasanaku.participants.length} de {selectedPasanaku.totalContributions} participantes
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-3">
                  {selectedPasanaku.participants.map((participant, index) => (
                    <div 
                      key={participant.address} 
                      className={`flex justify-between items-center p-3 rounded-lg ${
                        participant.address === address ? 'bg-primary-50 border border-primary-200' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">
                            {formatAddress(participant.address)}
                            {participant.address === address && ' (Tú)'}
                          </p>
                          {participant.turnNumber && (
                            <p className="text-xs text-neutral-500">
                              {participant.turnNumber === selectedPasanaku.currentCycle 
                                ? 'Turno actual' 
                                : `Turno #${participant.turnNumber}`}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${participant.status === 'paid' ? 'bg-success-100 text-success-700' : 
                            participant.status === 'received' ? 'bg-accent-100 text-accent-700' :
                            'bg-warning-100 text-warning-700'}`}
                        >
                          {participant.status === 'paid' ? 'Pagado' : 
                           participant.status === 'received' ? 'Recibido' : 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>
          </motion.div>
          
          {/* Transaction history */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <Card.Header>
                <Card.Title>Historial de Transacciones</Card.Title>
              </Card.Header>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Dirección</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Monto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">TX</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPasanaku.transactions.length > 0 ? (
                      selectedPasanaku.transactions.map((tx: Transaction) => (
                        <tr key={tx.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              {getTransactionIcon(tx.type)}
                              <span className="ml-2">
                                {tx.type === 'contribution' ? 'Aporte' : 
                                 tx.type === 'payout' ? 'Cobro' : 'Unión'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {formatAddress(tx.address)}
                            {tx.address === address && ' (Tú)'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {new Date(tx.timestamp).toLocaleDateString('es-BO')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {tx.txHash && (
                              <a 
                                href={`https://polkadot.subscan.io/extrinsic/${tx.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 flex items-center"
                              >
                                <ExternalLink size={14} className="mr-1" />
                                Ver
                              </a>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-neutral-500">
                          No hay transacciones registradas
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
        
        {/* Right column - Actions and Info */}
        <div className="space-y-6">
          {/* Current status and actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <Card.Header>
                <Card.Title>Acciones</Card.Title>
              </Card.Header>
              <Card.Content>
                {selectedPasanaku.status === 'active' && (
                  <>
                    {isPayoutRecipient && allPaid ? (
                      <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-success-700 mb-2">¡Es tu turno de cobrar!</h3>
                        <p className="text-success-600 text-sm mb-4">
                          Todos los participantes han pagado sus cuotas. Puedes cobrar el pozo ahora.
                        </p>
                        <Button
                          fullWidth
                          className="bg-success-600 hover:bg-success-700"
                          isLoading={isClaiming}
                          onClick={handleClaim}
                        >
                          Cobrar {formatCurrency(selectedPasanaku.currentPot)}
                        </Button>
                      </div>
                    ) : !hasPaid ? (
                      <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-warning-700 mb-2">Pago Pendiente</h3>
                        <p className="text-warning-600 text-sm mb-4">
                          Necesitas realizar tu aporte para este ciclo del Pasanaku.
                        </p>
                        <Button
                          fullWidth
                          className="bg-warning-600 hover:bg-warning-700"
                          isLoading={isContributing}
                          onClick={handleContribute}
                        >
                          Pagar {formatCurrency(selectedPasanaku.contributionAmount)}
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 mb-4">
                        <h3 className="font-medium text-neutral-700 mb-2">Tu cuota está pagada</h3>
                        <p className="text-neutral-600 text-sm">
                          Has completado tu aporte para este ciclo. Esperando a que todos los participantes paguen.
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Estado del ciclo actual</h3>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Participantes que han pagado:</span>
                        <span className="font-semibold">{selectedPasanaku.participants.filter(p => p.status === 'paid').length}/{selectedPasanaku.participants.length}</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${(selectedPasanaku.participants.filter(p => p.status === 'paid').length / selectedPasanaku.participants.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </>
                )}
                
                {selectedPasanaku.status === 'open' && (
                  <div className="text-center py-4">
                    <p className="text-neutral-600 mb-4">
                      Este Pasanaku está abierto para que se unan nuevos participantes.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Implementation to copy invite link
                        navigator.clipboard.writeText(`${window.location.origin}/join/${selectedPasanaku.id}`);
                        alert('Link de invitación copiado al portapapeles');
                      }}
                    >
                      Copiar link de invitación
                    </Button>
                  </div>
                )}
                
                {selectedPasanaku.status === 'completed' && (
                  <div className="text-center py-4">
                    <p className="text-neutral-600">
                      Este Pasanaku ha sido completado. Todos los ciclos han finalizado.
                    </p>
                  </div>
                )}
              </Card.Content>
            </Card>
          </motion.div>
          
          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <Card.Header>
                <Card.Title>Información</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4 text-sm text-neutral-700">
                  <p>
                    <span className="font-medium">Tipo de Orden de Cobro: </span>
                    {selectedPasanaku.payoutType === 'fixed' 
                      ? 'Orden fijo (por orden de unión)' 
                      : 'Sorteo al inicio'}
                  </p>
                  
                  <p>
                    <span className="font-medium">Monto Total del Ciclo: </span>
                    {formatCurrency(parseFloat(selectedPasanaku.contributionAmount) * selectedPasanaku.participants.length)}
                  </p>
                  
                  <p>
                    <span className="font-medium">Privacidad: </span>
                    {selectedPasanaku.isPublic ? 'Público' : 'Privado'}
                  </p>
                  
                  <div>
                    <p className="font-medium mb-1">Contrato Inteligente: </p>
                    <a 
                      href="https://polkadot.subscan.io/contract/EXAMPLE_CONTRACT_ADDRESS"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      <span className="truncate">0x1234...5678</span>
                      <ExternalLink size={14} className="ml-1 flex-shrink-0" />
                    </a>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PasanakuDetails;