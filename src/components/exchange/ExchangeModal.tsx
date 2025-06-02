import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, ArrowRight, QrCode, ExternalLink, TrendingUp } from 'lucide-react';
import { useExchangeStore, BankInfo } from '../../stores/exchangeStore';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Bank QR data
const BANK_QR_DATA = {
  bankName: "Banco Unión S.A.",
  accountNumber: "1-2345678-90",
  accountHolder: "Pasacoin SRL",
  ci: "1234567 LP"
};

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({ isOpen, onClose, type }) => {
  const { depositUSDT, withdrawUSDT, isLoading, rates } = useExchangeStore();
  
  const [amount, setAmount] = useState('');
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    accountHolder: '',
    ci: '',
    bankName: '',
    accountNumber: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await (type === 'deposit' 
      ? depositUSDT(parseFloat(amount), bankInfo)
      : withdrawUSDT(parseFloat(amount), bankInfo));
    
    if (success) {
      onClose();
    }
  };
  
  const bankOptions = [
    { value: 'BNB', label: 'Banco Nacional de Bolivia' },
    { value: 'BCP', label: 'Banco de Crédito de Bolivia' },
    { value: 'BMSC', label: 'Banco Mercantil Santa Cruz' },
    { value: 'BU', label: 'Banco Unión' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm"
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-500"
              >
                <X size={20} />
              </button>
              
              {/* Title */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold">
                  {type === 'deposit' ? 'Depositar vía QR' : 'Retirar vía P2P'}
                </h3>
                <p className="text-sm text-neutral-500">
                  {type === 'deposit' 
                    ? 'Escanea el QR para depositar BOB y recibir USDT'
                    : 'Vende tus USDT de forma segura en Binance P2P'}
                </p>
              </div>
              
              <div className="space-y-4">
                {type === 'deposit' ? (
                  <div className="text-center">
                    {rates.length > 0 && (
                      <div className="bg-primary-50 p-4 rounded-lg mb-4 flex items-center justify-center gap-2">
                        <TrendingUp className="text-primary-600\" size={20} />
                        <span className="text-primary-700">
                          1 USDT = {rates[rates.length - 1].rate.toFixed(2)} BOB
                        </span>
                      </div>
                    )}
                    <div className="bg-neutral-50 p-6 rounded-lg mb-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                        <QrCode className="w-48 h-48 mx-auto" />
                      </div>
                      <div className="text-sm text-left space-y-2">
                        <p><span className="font-medium">Banco:</span> {BANK_QR_DATA.bankName}</p>
                        <p><span className="font-medium">Cuenta:</span> {BANK_QR_DATA.accountNumber}</p>
                        <p><span className="font-medium">Titular:</span> {BANK_QR_DATA.accountHolder}</p>
                        <p><span className="font-medium">CI:</span> {BANK_QR_DATA.ci}</p>
                      </div>
                    </div>
                    <p className="text-sm text-neutral-600 mb-4">
                      1. Escanea el QR o usa los datos bancarios<br/>
                      2. Realiza la transferencia en BOB<br/>
                      3. Recibirás USDT automáticamente en tu wallet
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-neutral-50 p-6 rounded-lg mb-6">
                      <h4 className="font-medium mb-4">Vender USDT en Binance P2P</h4>
                      <Button
                        onClick={() => window.open('https://p2p.binance.com/es/trade/sell/USDT?fiat=BOB', '_blank')}
                        className="flex items-center justify-center gap-2"
                      >
                        Ir a Binance P2P <ExternalLink size={16} />
                      </Button>
                    </div>
                    <p className="text-sm text-neutral-600">
                      Serás redirigido a Binance P2P donde podrás vender<br/>
                      tus USDT de forma segura por BOB
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExchangeModal;