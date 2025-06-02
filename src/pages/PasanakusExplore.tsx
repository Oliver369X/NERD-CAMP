import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePasanakuStore, PaymentFrequency } from '../stores/pasanakuStore';
import PasanakuCard from '../components/pasanaku/PasanakuCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { toast } from 'sonner';

const PasanakusExplore: React.FC = () => {
  const { publicPasanakus, isLoading, fetchPublicPasanakus, joinPasanaku } = usePasanakuStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    frequency: '',
    minAmount: '',
    maxAmount: ''
  });
  
  useEffect(() => {
    fetchPublicPasanakus();
  }, [fetchPublicPasanakus]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleJoin = async (id: string) => {
    const success = await joinPasanaku(id);
    if (success) {
      toast.success('Te has unido al Pasanaku exitosamente');
    }
  };
  
  // Apply filters and search
  const filteredPasanakus = publicPasanakus.filter(pasanaku => {
    // Search term filter
    if (searchTerm && !pasanaku.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (filters.status && pasanaku.status !== filters.status) {
      return false;
    }
    
    // Frequency filter
    if (filters.frequency && pasanaku.frequency !== filters.frequency) {
      return false;
    }
    
    // Min amount filter
    if (filters.minAmount && parseFloat(pasanaku.contributionAmount) < parseFloat(filters.minAmount)) {
      return false;
    }
    
    // Max amount filter
    if (filters.maxAmount && parseFloat(pasanaku.contributionAmount) > parseFloat(filters.maxAmount)) {
      return false;
    }
    
    return true;
  });
  
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'open', label: 'Abiertos para unirse' },
    { value: 'active', label: 'Activos' },
    { value: 'completed', label: 'Completados' }
  ];
  
  const frequencyOptions = [
    { value: '', label: 'Todas las frecuencias' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'biweekly', label: 'Quincenal' },
    { value: 'monthly', label: 'Mensual' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Explorar Pasanakus</h1>
        <p className="text-neutral-600 mb-8">
          Encuentra y únete a Pasanakus públicos creados por la comunidad
        </p>
      </motion.div>
      
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
          <div className="flex-grow">
            <Input
              placeholder="Buscar por nombre..."
              icon={<Search size={18} />}
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Button
            variant="outline"
            icon={<SlidersHorizontal size={18} />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
            {showFilters ? ' ▲' : ' ▼'}
          </Button>
        </div>
        
        {/* Expandable filters */}
        {showFilters && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-white rounded-lg border border-neutral-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Select
              label="Estado"
              options={statusOptions}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Frecuencia"
              options={frequencyOptions}
              value={filters.frequency}
              onChange={(value) => handleFilterChange('frequency', value)}
            />
            
            <Input
              type="number"
              label="Monto Mínimo (USDT)"
              placeholder="0"
              value={filters.minAmount}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            />
            
            <Input
              type="number"
              label="Monto Máximo (USDT)"
              placeholder="1000"
              value={filters.maxAmount}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            />
          </motion.div>
        )}
      </div>
      
      {/* Pasanakus Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
        </div>
      ) : filteredPasanakus.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredPasanakus.map(pasanaku => (
            <PasanakuCard 
              key={pasanaku.id} 
              pasanaku={pasanaku}
              showJoinButton={pasanaku.status === 'open'}
              onJoin={() => handleJoin(pasanaku.id)}
            />
          ))}
        </motion.div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No se encontraron Pasanakus</h3>
          <p className="text-neutral-600 mb-6">
            No hay Pasanakus públicos que coincidan con tus criterios de búsqueda.
          </p>
          <Button onClick={() => {
            setSearchTerm('');
            setFilters({
              status: '',
              frequency: '',
              minAmount: '',
              maxAmount: ''
            });
          }}>
            Limpiar Filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default PasanakusExplore;