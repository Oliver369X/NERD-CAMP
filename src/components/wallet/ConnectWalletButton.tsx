import React, { useState } from 'react';
import { Wallet, ExternalLink } from 'lucide-react';
import { useWalletStore } from '../../stores/walletStore';
import { formatAddress } from '../../lib/utils';
import Button from '../ui/Button';

const ConnectWalletButton: React.FC = () => {
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet } = useWalletStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleConnect = async () => {
    await connectWallet();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setShowDropdown(false);
  };

  // If wallet is not connected, show connect button
  if (!isConnected) {
    return (
      <Button
        variant="primary"
        size="md"
        onClick={handleConnect}
        isLoading={isConnecting}
        icon={<Wallet size={18} />}
      >
        {isConnecting ? 'Conectando...' : 'Conectar Billetera'}
      </Button>
    );
  }

  // If wallet is connected, show address with dropdown
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="md"
        icon={<Wallet size={18} />}
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-white hover:bg-neutral-50"
      >
        {formatAddress(address)}
      </Button>

      {/* Dropdown menu */}
      {showDropdown && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="wallet-menu-button"
        >
          <div className="py-1" role="none">
            <a
              href={`https://polkadot.subscan.io/account/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
              role="menuitem"
            >
              <ExternalLink size={16} className="mr-2" />
              Ver en Subscan
            </a>
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-error-600 hover:bg-neutral-100 hover:text-error-700"
              role="menuitem"
              onClick={handleDisconnect}
            >
              Desconectar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWalletButton;