import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

interface ExchangeRate {
  timestamp: number;
  rate: number;
}

interface BinanceP2PResponse {
  data: Array<{
    adv: {
      price: string;
    }
  }>;
}

interface ExchangeState {
  rates: ExchangeRate[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRates: () => Promise<void>;
  depositUSDT: (amount: number, bankInfo: BankInfo) => Promise<boolean>;
  withdrawUSDT: (amount: number, bankInfo: BankInfo) => Promise<boolean>;
}

export interface BankInfo {
  accountHolder: string;
  ci: string;
  bankName: string;
  accountNumber: string;
}

export const useExchangeStore = create<ExchangeState>()(
  persist(
    (set) => ({
      rates: [],
      isLoading: false,
      error: null,

      fetchRates: async () => {
        try {
          set({ isLoading: true, error: null });
          const url = "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search";

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "asset": "USDT",
              "fiat": "BOB",
              "tradeType": "SELL",
              "payTypes": [],
              "page": 1,
              "rows": 5
            })
          });

          if (!response.ok) {
            throw new Error('Failed to fetch Binance P2P rates');
          }

          const data: BinanceP2PResponse = await response.json();
          if (!data?.data?.length) {
            throw new Error('No P2P offers available');
          }

          const currentRate = parseFloat(data.data[0].adv.price);
          set({ 
            rates: [{ timestamp: Date.now(), rate: currentRate }],
            isLoading: false 
          });
        } catch (error) {
          console.error('Error fetching rates:', error);
          set({ error: 'Error al obtener tipos de cambio', isLoading: false });
        }
      },

      depositUSDT: async (amount: number, bankInfo: BankInfo) => {
        try {
          set({ isLoading: true, error: null });
          
          // Validaciones
          if (amount <= 0) {
            toast.error('El monto debe ser mayor a 0');
            return false;
          }
          
          if (!bankInfo.accountHolder || !bankInfo.ci || !bankInfo.bankName || !bankInfo.accountNumber) {
            toast.error('Todos los campos bancarios son requeridos');
            return false;
          }
          
          // Simular procesamiento
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          toast.success(`Solicitud de depósito de ${amount} USDT procesada`);
          return true;
        } catch (error) {
          console.error('Error processing deposit:', error);
          set({ error: 'Error al procesar el depósito', isLoading: false });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      withdrawUSDT: async (amount: number, bankInfo: BankInfo) => {
        try {
          set({ isLoading: true, error: null });
          
          // Validaciones
          if (amount <= 0) {
            toast.error('El monto debe ser mayor a 0');
            return false;
          }
          
          if (!bankInfo.accountHolder || !bankInfo.ci || !bankInfo.bankName || !bankInfo.accountNumber) {
            toast.error('Todos los campos bancarios son requeridos');
            return false;
          }
          
          // Simular procesamiento
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          toast.success(`Solicitud de retiro de ${amount} USDT procesada`);
          return true;
        } catch (error) {
          console.error('Error processing withdrawal:', error);
          set({ error: 'Error al procesar el retiro', isLoading: false });
          return false;
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'pasacoin-exchange',
      partialize: (state) => ({ rates: state.rates })
    }
  )
);