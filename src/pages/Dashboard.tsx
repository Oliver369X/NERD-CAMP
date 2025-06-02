import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, TrendingUp, Clock, AlertCircle, Users, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../stores/walletStore';
import { usePasanakuStore } from '../stores/pasanakuStore';
import { useExchangeStore } from '../stores/exchangeStore';
import PasanakuCard from '../components/pasanaku/PasanakuCard';
import ExchangeModal from '../components/exchange/ExchangeModal';
import PriceChart from '../components/exchange/PriceChart';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { formatCurrency, formatAddress } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { address, balance } = useWalletStore();
  const { myPasanakus, isLoading, fetchMyPasanakus } = usePasanakuStore();
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [exchangeType, setExchangeType] = useState<'deposit' | 'withdraw'>('deposit');
  
  useEffect(() => {
    fetchMyPasanakus();
  }, [fetchMyPasanakus]);
  
  // Check if user has any upcoming payment or payout
  const upcomingPayment = myPasanakus.find(p => 
    p.participants.some(part => 
      part.address === address && part.status === 'pending' && p.status === 'active'
    )
  );
  
  const upcomingPayout = myPasanakus.find(p => 
    p.currentPayoutAddress === address && p.status === 'active'
  );
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Bienvenido a Pasacoin</h1>
        <p className="text-neutral-600 mb-8">
          Tu dashboard de Pasanakus seguros en blockchain
        </p>
      </motion.div>
      
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
      >
        {/* USDT Balance */}
        <motion.div variants={itemAnimation}>
          <Card className="h-full">
            <Card.Content className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mr-4">
                <TrendingUp size={24} className="text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Balance USDT</p>
                <p className="text-2xl font-bold">{formatCurrency(balance || '0')}</p>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
        
        {/* Active Pasanakus */}
        <motion.div variants={itemAnimation}>
          <Card className="h-full">
            <Card.Content className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                <Clock size={24} className="text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Pasanakus Activos</p>
                <p className="text-2xl font-bold">{myPasanakus.filter(p => p.status === 'active').length}</p>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
        
        {/* Pending Actions */}
        <motion.div variants={itemAnimation}>
          <Card className="h-full">
            <Card.Content className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-error-100 flex items-center justify-center mr-4">
                <AlertCircle size={24} className="text-error-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Acciones Pendientes</p>
                <p className="text-2xl font-bold">{upcomingPayment ? '1' : '0'}</p>
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Alerts */}
      {(upcomingPayment || upcomingPayout) && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {upcomingPayout && (
            <div className="bg-success-50 border border-success-200 rounded-lg p-4 mb-4 flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                  <TrendingUp size={18} className="text-success-700" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-success-700">¡Es tu turno de cobrar!</h3>
                <p className="text-success-600 mt-1">
                  Puedes cobrar {formatCurrency(upcomingPayout.currentPot)} del Pasanaku "{upcomingPayout.name}".
                </p>
                <div className="mt-3">
                  <Link to={`/pasanaku/${upcomingPayout.id}`}>
                    <Button size="sm" className="bg-success-600 hover:bg-success-700">
                      Cobrar Ahora
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
          
          {upcomingPayment && (
            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 flex items-start">
              <div className="flex-shrink-0 mr-3">
                <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                  <Clock size={18} className="text-warning-700" />
                </div>
              </div>
              <div>
                <h3 className="font-medium text-warning-700">Pago Pendiente</h3>
                <p className="text-warning-600 mt-1">
                  Tienes un pago pendiente de {formatCurrency(upcomingPayment.contributionAmount)} para el Pasanaku "{upcomingPayment.name}".
                </p>
                <div className="mt-3">
                  <Link to={`/pasanaku/${upcomingPayment.id}`}>
                    <Button size="sm" className="bg-warning-600 hover:bg-warning-700">
                      Pagar Ahora
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Quick Actions */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            variant="outline"
            fullWidth
            className="h-full py-6 flex-col"
            onClick={() => {
              setExchangeType('deposit');
              setExchangeModalOpen(true);
            }}
          >
            <ArrowUpRight size={24} className="mb-2" />
            <span>Depositar USDT vía QR</span>
          </Button>
          
          <Button 
            variant="outline"
            fullWidth
            className="h-full py-6 flex-col"
            onClick={() => {
              setExchangeType('withdraw');
              setExchangeModalOpen(true);
            }}
          >
            <ArrowDownLeft size={24} className="mb-2" />
            <span>Retirar USDT vía P2P</span>
          </Button>
          
          <Link to="/create">
            <Button 
              variant="outline"
              fullWidth
              className="h-full py-6 flex-col"
            >
              <PlusCircle size={24} className="mb-2" />
              <span>Crear Nuevo Pasanaku</span>
            </Button>
          </Link>
          
          <Link to="/explore">
            <Button 
              variant="outline"
              fullWidth
              className="h-full py-6 flex-col"
            >
              <Users size={24} className="mb-2" />
              <span>Explorar Pasanakus Públicos</span>
            </Button>
          </Link>
        </div>
      </motion.div>
      
      {/* Price Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-12"
      >
        <PriceChart />
      </motion.div>
      
      {/* Exchange Modal */}
      <ExchangeModal
        isOpen={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        type={exchangeType}
      />
      
      {/* My Pasanakus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mis Pasanakus</h2>
          <Link to="/explore">
            <Button variant="link" size="sm">
              Ver Todos
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
          </div>
        ) : myPasanakus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {myPasanakus.map(pasanaku => (
              <PasanakuCard 
                key={pasanaku.id} 
                pasanaku={pasanaku} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No tienes Pasanakus activos</h3>
            <p className="text-neutral-600 mb-6">
              Comienza creando tu primer Pasanaku o uniéndote a uno existente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/create">
                <Button>
                  Crear Pasanaku
                </Button>
              </Link>
              <Link to="/explore">
                <Button variant="outline">
                  Explorar Existentes
                </Button>
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;