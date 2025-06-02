import { create } from 'zustand';
import { toast } from 'sonner';

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  provider: any | null;
  balance: string | null;
  chainId: string | null;
  authToken: string | null;
  
  // Actions
  connectWallet: (providerName?: string) => Promise<void>;
  disconnectWallet: () => void;
  checkForExistingSession: () => void;
  signMessage: (message: string) => Promise<string | null>;
}

// Define providers we support
const SUPPORTED_WALLET_PROVIDERS = [
  'polkadot-js',
  'talisman',
  'subwallet',
  'metamask' // For testing with Ethereum wallets
];

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  isConnected: false,
  isConnecting: false,
  provider: null,
  balance: null,
  chainId: null,
  authToken: localStorage.getItem('auth_token'),
  
  connectWallet: async (providerName) => {
    try {
      set({ isConnecting: true });
      // SOLO PARA DESARROLLO: Simular conexión exitosa inmediatamente
      const mockAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      const mockProvider = { name: providerName };
      const mockBalance = '1000.00';
      const mockChainId = '0x01';

      set({
        address: mockAddress,
        provider: mockProvider,
        balance: mockBalance,
        chainId: mockChainId,
        isConnected: true,
        isConnecting: false
      });
      
      toast.success('Wallet connected successfully!');
      
      // Proceed with authentication using signature
      await get().authenticate();
      
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet. Please try again.');
      set({ isConnecting: false });
    }
  },
  
  disconnectWallet: () => {
    // Clear auth token
    localStorage.removeItem('auth_token');
    
    // Reset state
    set({
      address: null,
      isConnected: false,
      provider: null,
      balance: null,
      chainId: null,
      authToken: null
    });
    
    toast.success('Wallet disconnected');
  },
  
  checkForExistingSession: () => {
    const authToken = localStorage.getItem('auth_token');
    
    if (authToken) {
      // For demo, we're assuming the token is valid
      // In a real app, we would verify the token with the backend
      
      // Mock wallet data for demo
      set({
        authToken,
        isConnected: true,
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        balance: '1000.00',
        chainId: '0x01',
        provider: { name: 'metamask' }
      });
    }
  },
  
  // Sign a message using the connected wallet
  signMessage: async (message: string): Promise<string | null> => {
    try {
      const { provider, address } = get();
      
      if (!provider || !address) {
        toast.error('No wallet connected');
        return null;
      }
      
      // For demo purposes, simulate a signature
      // In a real app, we would use the wallet provider's API to sign the message
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockSignature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      
      return mockSignature;
    } catch (error) {
      console.error('Error signing message:', error);
      toast.error('Failed to sign message');
      return null;
    }
  },
  
  // Authenticate with backend using wallet signature
  authenticate: async () => {
    try {
      const { address, signMessage } = get();
      
      if (!address) {
        throw new Error('No wallet connected');
      }
      
      // 1. Request message from backend
      // For demo, we're using a mock message
      // In a real app: const response = await fetch('/api/auth/request-message', { method: 'POST', body: JSON.stringify({ address }) });
      const mockMessage = `Sign this message to authenticate with Pasacoin: ${Math.floor(Date.now() / 1000)}`;
      
      // 2. Request user to sign the message
      const signature = await signMessage(mockMessage);
      
      if (!signature) {
        throw new Error('Failed to sign message');
      }
      
      // 3. Verify signature with backend
      // For demo, we're assuming verification success
      // In a real app: const verifyResponse = await fetch('/api/auth/verify-signature', { method: 'POST', body: JSON.stringify({ address, signature, message: mockMessage }) });
      
      // Mock successful authentication
      const mockAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiNUdyd3ZhRUY1elh...';
      
      // Store auth token
      localStorage.setItem('auth_token', mockAuthToken);
      set({ authToken: mockAuthToken });
      
      toast.success('Authentication successful');
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Authentication failed');
    }
  }
}));