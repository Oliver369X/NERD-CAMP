import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export type PasanakuStatus = 'open' | 'active' | 'completed';
export type ParticipantStatus = 'pending' | 'paid' | 'received';
export type PaymentFrequency = 'weekly' | 'biweekly' | 'monthly';
export type PayoutType = 'fixed' | 'random';

export interface Participant {
  address: string;
  status: ParticipantStatus;
  turnNumber?: number;
  displayName?: string;
}

export interface Transaction {
  id: string;
  type: 'contribution' | 'payout' | 'join';
  amount: string;
  timestamp: number;
  address: string;
  txHash?: string;
}

export interface Pasanaku {
  id: string;
  name: string;
  creatorAddress: string;
  contributionAmount: string;
  totalContributions: number;
  currentCycle: number;
  maxCycles: number;
  frequency: PaymentFrequency;
  payoutType: PayoutType;
  isPublic: boolean;
  status: PasanakuStatus;
  participants: Participant[];
  currentPot: string;
  transactions: Transaction[];
  nextPaymentDue?: number;
  currentPayoutAddress?: string;
}

interface PasanakuState {
  myPasanakus: Pasanaku[];
  publicPasanakus: Pasanaku[];
  selectedPasanaku: Pasanaku | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchMyPasanakus: () => Promise<void>;
  fetchPublicPasanakus: (filters?: any) => Promise<void>;
  fetchPasanakuDetails: (id: string) => Promise<void>;
  createPasanaku: (pasanakuData: any) => Promise<boolean>;
  joinPasanaku: (id: string) => Promise<boolean>;
  contributeToPool: (id: string, amount: string) => Promise<boolean>;
  claimPayout: (id: string) => Promise<boolean>;
}

export const usePasanakuStore = create<PasanakuState>()(
  persist(
    (set, get) => ({
  myPasanakus: [],
  publicPasanakus: [],
  selectedPasanaku: null,
  isLoading: false,
  error: null,

  fetchMyPasanakus: async () => {
    try {
      set({ isLoading: true, error: null });
      set({ isLoading: false });
    } catch (error) {
      console.error('Error fetching my pasanakus:', error);
      set({ error: 'Failed to load your pasanakus', isLoading: false });
    }
  },

  fetchPublicPasanakus: async (filters = {}) => {
    try {
      set({ isLoading: true, error: null });
      const { myPasanakus } = get();
      set({ 
        publicPasanakus: myPasanakus.filter(p => p.isPublic), 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching public pasanakus:', error);
      set({ error: 'Failed to load available pasanakus', isLoading: false });
    }
  },

  fetchPasanakuDetails: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const { myPasanakus } = get();
      const pasanaku = myPasanakus.find(p => p.id === id) || null;
      
      if (!pasanaku) {
        set({ error: 'Pasanaku not found', isLoading: false });
        return;
      }
      
      set({ selectedPasanaku: pasanaku, isLoading: false });
    } catch (error) {
      console.error('Error fetching pasanaku details:', error);
      set({ error: 'Failed to load pasanaku details', isLoading: false });
    }
  },

  createPasanaku: async (pasanakuData) => {
    try {
      set({ isLoading: true, error: null });
      
      // Mock user address for development
      const address = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
      
      // Validaciones
      if (!pasanakuData.name?.trim()) {
        toast.error('El nombre del Pasanaku es requerido');
        set({ isLoading: false });
        return false;
      }
      
      if (!pasanakuData.contributionAmount || parseFloat(pasanakuData.contributionAmount) <= 0) {
        toast.error('El monto de contribución debe ser mayor a 0');
        set({ isLoading: false });
        return false;
      }
      
      if (!pasanakuData.participants || parseInt(pasanakuData.participants) < 2) {
        toast.error('Se requieren al menos 2 participantes');
        set({ isLoading: false });
        return false;
      }
      
      // For demo: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app: const response = await fetch('/api/pasanakus', { method: 'POST', body: JSON.stringify(pasanakuData) });
      // const data = await response.json();
      
      // Mock successful creation
      const newPasanaku: Pasanaku = {
        id: Math.random().toString(36).substring(2, 9),
        name: pasanakuData.name,
        creatorAddress: address,
        contributionAmount: pasanakuData.contributionAmount.toString(),
        totalContributions: pasanakuData.participants,
        currentCycle: 0,
        maxCycles: pasanakuData.participants,
        frequency: pasanakuData.frequency,
        payoutType: pasanakuData.payoutType,
        isPublic: pasanakuData.isPublic || false,
        status: 'open',
        participants: [
          { 
            address: address,
            status: 'pending',
            turnNumber: 1
          }
        ],
        currentPot: '0',
        transactions: [],
        nextPaymentDue: Date.now() + 14 * 24 * 60 * 60 * 1000
      };
      
      // Update both myPasanakus and publicPasanakus arrays
      set(state => ({
        myPasanakus: [newPasanaku, ...state.myPasanakus],
        publicPasanakus: newPasanaku.isPublic 
          ? [newPasanaku, ...state.publicPasanakus]
          : state.publicPasanakus,
        isLoading: false
      }));

      // Log para desarrollo
      console.log('Nuevo Pasanaku creado:', newPasanaku);
      
      toast.success('Pasanaku creado exitosamente');
      return true;
    } catch (error) {
      console.error('Error creating pasanaku:', error);
      set({ error: 'Failed to create pasanaku', isLoading: false });
      return false;
    }
  },

  joinPasanaku: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // For demo: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // In a real app: const response = await fetch(`/api/pasanakus/${id}/join`, { method: 'POST' });
      // const data = await response.json();
      
      // Mock successful join
      // Update pasanakus with the joined one
      const updatedPublicPasanakus = get().publicPasanakus.map(p => {
        if (p.id === id) {
          const updatedParticipants = [
            ...p.participants,
            { address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', status: 'pending' }
          ];
          
          return { 
            ...p, 
            participants: updatedParticipants
          };
        }
        return p;
      });
      
      set({
        publicPasanakus: updatedPublicPasanakus,
        myPasanakus: [...get().myPasanakus, get().publicPasanakus.find(p => p.id === id)!],
        isLoading: false
      });
      
      toast.success('Te has unido al Pasanaku exitosamente');
      return true;
    } catch (error) {
      console.error('Error joining pasanaku:', error);
      set({ error: 'Failed to join pasanaku', isLoading: false });
      return false;
    }
  },

  contributeToPool: async (id: string, amount: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // For demo: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app: const response = await fetch(`/api/pasanakus/${id}/contribute`, { method: 'POST', body: JSON.stringify({ amount }) });
      // const data = await response.json();
      
      // Mock successful contribution
      // Update my pasanakus with the contribution
      const updatedMyPasanakus = get().myPasanakus.map(p => {
        if (p.id === id) {
          const newTransaction = {
            id: Math.random().toString(36).substring(2, 9),
            type: 'contribution' as const,
            amount,
            timestamp: Date.now(),
            address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
            txHash: '0x' + Math.random().toString(36).substring(2, 10)
          };
          
          const updatedParticipants = p.participants.map(participant => {
            if (participant.address === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
              return { ...participant, status: 'paid' as const };
            }
            return participant;
          });
          
          const currentPot = (parseFloat(p.currentPot) + parseFloat(amount)).toString();
          
          return { 
            ...p, 
            currentPot,
            participants: updatedParticipants,
            transactions: [...p.transactions, newTransaction]
          };
        }
        return p;
      });
      
      set({
        myPasanakus: updatedMyPasanakus,
        selectedPasanaku: get().selectedPasanaku?.id === id 
          ? updatedMyPasanakus.find(p => p.id === id) || null
          : get().selectedPasanaku,
        isLoading: false
      });
      
      toast.success('Contribución realizada exitosamente');
      return true;
    } catch (error) {
      console.error('Error making contribution:', error);
      set({ error: 'Failed to make contribution', isLoading: false });
      return false;
    }
  },

  claimPayout: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // For demo: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app: const response = await fetch(`/api/pasanakus/${id}/disburse`, { method: 'POST' });
      // const data = await response.json();
      
      // Mock successful payout
      // Update my pasanakus with the payout
      const pasanaku = get().myPasanakus.find(p => p.id === id);
      
      if (!pasanaku) {
        set({ error: 'Pasanaku not found', isLoading: false });
        return false;
      }
      
      const payoutAmount = pasanaku.currentPot;
      
      const updatedMyPasanakus = get().myPasanakus.map(p => {
        if (p.id === id) {
          const newTransaction = {
            id: Math.random().toString(36).substring(2, 9),
            type: 'payout' as const,
            amount: payoutAmount,
            timestamp: Date.now(),
            address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
            txHash: '0x' + Math.random().toString(36).substring(2, 10)
          };
          
          const updatedParticipants = p.participants.map(participant => {
            if (participant.address === '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY') {
              return { ...participant, status: 'received' as const };
            }
            return { ...participant, status: 'pending' as const };
          });
          
          return { 
            ...p, 
            currentPot: '0',
            currentCycle: p.currentCycle + 1,
            participants: updatedParticipants,
            transactions: [...p.transactions, newTransaction],
            status: p.currentCycle + 1 >= p.maxCycles ? 'completed' as const : 'active' as const
          };
        }
        return p;
      });
      
      set({
        myPasanakus: updatedMyPasanakus,
        selectedPasanaku: get().selectedPasanaku?.id === id 
          ? updatedMyPasanakus.find(p => p.id === id) || null
          : get().selectedPasanaku,
        isLoading: false
      });
      
      toast.success(`Has recibido ${payoutAmount} USDT exitosamente`);
      return true;
    } catch (error) {
      console.error('Error claiming payout:', error);
      set({ error: 'Failed to claim payout', isLoading: false });
      return false;
    }
  }
    }),
    {
      name: 'pasacoin-store',
      partialize: (state) => ({ 
        myPasanakus: state.myPasanakus,
        publicPasanakus: state.publicPasanakus 
      })
    }
  )
);