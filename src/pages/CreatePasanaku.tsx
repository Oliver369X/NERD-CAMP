import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { usePasanakuStore, PaymentFrequency, PayoutType } from '../stores/pasanakuStore';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';

const CreatePasanaku: React.FC = () => {
  const navigate = useNavigate();
  const { createPasanaku, isLoading } = usePasanakuStore();
  
  const [formData, setFormData] = useState({
    name: '',
    contributionAmount: '',
    participants: '',
    frequency: 'monthly' as PaymentFrequency,
    payoutType: 'fixed' as PayoutType,
    isPublic: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleToggleChange = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.contributionAmount) {
      newErrors.contributionAmount = 'El monto de cuota es requerido';
    } else if (parseFloat(formData.contributionAmount) <= 0) {
      newErrors.contributionAmount = 'El monto debe ser mayor a 0';
    }
    
    if (!formData.participants) {
      newErrors.participants = 'El número de participantes es requerido';
    } else if (parseInt(formData.participants, 10) < 2) {
      newErrors.participants = 'Se requieren al menos 2 participantes';
    } else if (parseInt(formData.participants, 10) > 20) {
      newErrors.participants = 'Máximo 20 participantes permitidos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const success = await createPasanaku(formData);
    
    if (success) {
      navigate('/dashboard');
    }
  };
  
  const frequencyOptions = [
    { value: 'weekly', label: 'Semanal' },
    { value: 'biweekly', label: 'Quincenal' },
    { value: 'monthly', label: 'Mensual' }
  ];
  
  const payoutTypeOptions = [
    { value: 'fixed', label: 'Orden fijo (por orden de unión)' },
    { value: 'random', label: 'Sorteo al inicio' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Crear Nuevo Pasanaku</h1>
        <p className="text-neutral-600 mb-8">
          Configura los detalles para tu nuevo Pasanaku en USDT
        </p>
      </motion.div>
      
      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit}>
            <Card.Header>
              <Card.Title>Información del Pasanaku</Card.Title>
              <Card.Description>
                Define las características principales de tu Pasanaku
              </Card.Description>
            </Card.Header>
            
            <Card.Content className="space-y-6">
              {/* Name */}
              <Input
                label="Nombre del Pasanaku"
                name="name"
                placeholder="Ej. Pasanaku Familiar"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
              />
              
              {/* Contribution Amount */}
              <Input
                type="number"
                label="Monto de la Cuota (USDT)"
                name="contributionAmount"
                placeholder="Ej. 100"
                value={formData.contributionAmount}
                onChange={handleInputChange}
                error={errors.contributionAmount}
                min="0.1"
                step="0.1"
              />
              
              {/* Number of Participants */}
              <Input
                type="number"
                label="Número de Participantes"
                name="participants"
                placeholder="Ej. 10"
                value={formData.participants}
                onChange={handleInputChange}
                error={errors.participants}
                min="2"
                max="20"
                helperText="Mínimo 2, máximo 20 participantes"
              />
              
              {/* Frequency */}
              <Select
                label="Frecuencia de Cuotas"
                name="frequency"
                options={frequencyOptions}
                value={formData.frequency}
                onChange={(value) => handleSelectChange('frequency', value)}
              />
              
              {/* Payout Type */}
              <Select
                label="Tipo de Orden de Cobro"
                name="payoutType"
                options={payoutTypeOptions}
                value={formData.payoutType}
                onChange={(value) => handleSelectChange('payoutType', value)}
              />
              
              {/* Privacy */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={() => handleToggleChange('isPublic')}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-5 w-5"
                  />
                  <span className="ml-2 text-sm text-neutral-700">
                    Pasanaku Público (visible para todos los usuarios)
                  </span>
                </label>
                <p className="mt-1 text-xs text-neutral-500">
                  Si no está marcado, solo podrán unirse usuarios con un enlace de invitación.
                </p>
              </div>
              
              {/* Info Box */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 text-primary-800 flex">
                <Info size={20} className="flex-shrink-0 mr-3 text-primary-500" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">Importante: </span>
                    Al crear un Pasanaku, serás automáticamente el primer participante. 
                    El monto total del pozo será de {formData.contributionAmount ? 
                      `${parseFloat(formData.contributionAmount) * (parseInt(formData.participants, 10) || 0)} USDT` : 
                      '0 USDT'}.
                  </p>
                </div>
              </div>
            </Card.Content>
            
            <Card.Footer className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="min-w-[120px]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
                className="min-w-[180px] bg-primary-600 hover:bg-primary-700 text-white"
              >
                Crear Pasanaku
              </Button>
            </Card.Footer>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreatePasanaku;