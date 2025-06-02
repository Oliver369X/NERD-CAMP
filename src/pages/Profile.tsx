import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, ExternalLink } from 'lucide-react';
import { useWalletStore } from '../stores/walletStore';
import { usePasanakuStore } from '../stores/pasanakuStore';
import { useProfileStore } from '../stores/profileStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatAddress } from '../lib/utils';
import { isValidEmail } from '../lib/utils';

const Profile: React.FC = () => {
  const { address, disconnectWallet } = useWalletStore();
  const { myPasanakus } = usePasanakuStore();
  const { userProfile, updateProfile, updateNotificationPreferences, isLoading } = useProfileStore();
  
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    email: userProfile?.email || '',
    bio: userProfile?.bio || ''
  });
  
  const [notifications, setNotifications] = useState(
    userProfile?.notificationPreferences || {
      email: false,
      paymentReminders: true,
      payoutNotifications: true,
      newMembers: false
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleNotificationChange = (key: string) => {
    const newPreferences = {
      ...notifications,
      [key]: !notifications[key]
    };
    setNotifications(newPreferences);
    updateNotificationPreferences(newPreferences);
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate email if provided
    if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    updateProfile(formData);
  };
  
  // Calculate stats
  const completedPasanakus = myPasanakus.filter(p => p.status === 'completed').length;
  const totalContributed = myPasanakus.reduce((total, pasanaku) => {
    const userTransactions = pasanaku.transactions
      .filter(tx => tx.address === address && tx.type === 'contribution')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    
    return total + userTransactions;
  }, 0);
  
  const totalReceived = myPasanakus.reduce((total, pasanaku) => {
    const userTransactions = pasanaku.transactions
      .filter(tx => tx.address === address && tx.type === 'payout')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    
    return total + userTransactions;
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mi Perfil</h1>
        <p className="text-neutral-600 mb-8">
          Gestiona tu información y preferencias
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - User info & stats */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <Card>
              <Card.Content className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                    <User size={32} className="text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">
                    {formData.displayName || 'Usuario de Pasacoin'}
                  </h3>
                  <p className="text-neutral-500 mb-3">{formatAddress(address)}</p>
                  <a
                    href={`https://polkadot.subscan.io/account/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    Ver en Subscan
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </Card.Content>
              <Card.Footer>
                <Button 
                  variant="outline"
                  fullWidth
                  className="text-error-600 hover:text-error-700 border-error-200 hover:bg-error-50"
                  onClick={() => disconnectWallet()}
                >
                  Desconectar Billetera
                </Button>
              </Card.Footer>
            </Card>
          </motion.div>
          
          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <Card.Header>
                <Card.Title>Mis Estadísticas</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-500">Pasanakus activos</p>
                    <p className="font-semibold text-lg">{myPasanakus.filter(p => p.status === 'active').length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Pasanakus completados</p>
                    <p className="font-semibold text-lg">{completedPasanakus}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total contribuido</p>
                    <p className="font-semibold text-lg text-accent-600">{totalContributed.toFixed(2)} USDT</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Total recibido</p>
                    <p className="font-semibold text-lg text-success-600">{totalReceived.toFixed(2)} USDT</p>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </motion.div>
        </div>
        
        {/* Right column - Profile form */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <form onSubmit={handleSubmit}>
                <Card.Header>
                  <Card.Title>Información Personal</Card.Title>
                  <Card.Description>
                    Actualiza tus datos de perfil
                  </Card.Description>
                </Card.Header>
                <Card.Content className="space-y-6">
                  <Input
                    label="Nombre de Usuario (opcional)"
                    name="displayName"
                    placeholder="¿Cómo quieres que te conozcan?"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    helperText="Este nombre se mostrará a otros usuarios"
                  />
                  
                  <Input
                    as="textarea"
                    label="Bio (opcional)"
                    name="bio"
                    placeholder="Cuéntanos un poco sobre ti..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="h-24 resize-none"
                  />
                  
                  <Input
                    type="email"
                    label="Email (opcional)"
                    name="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    helperText="Para recibir notificaciones importantes"
                  />
                </Card.Content>
                <Card.Footer>
                  <Button
                    type="submit"
                    isLoading={isLoading}
                  >
                    Guardar Cambios
                  </Button>
                </Card.Footer>
              </form>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <Card>
              <Card.Header>
                <Card.Title>Preferencias de Notificación</Card.Title>
                <Card.Description>
                  Configura qué notificaciones quieres recibir
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {/* Email notifications toggle */}
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                    <div>
                      <p className="font-medium">Notificaciones por Email</p>
                      <p className="text-sm text-neutral-500">Recibir notificaciones por email</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={() => handleNotificationChange('email')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Payment reminder toggle */}
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                    <div>
                      <p className="font-medium">Recordatorios de Pago</p>
                      <p className="text-sm text-neutral-500">Notificaciones cuando debas pagar una cuota</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.paymentReminders}
                          onChange={() => handleNotificationChange('paymentReminders')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  {/* Payout notification toggle */}
                  <div className="flex items-center justify-between py-2 border-b border-neutral-200">
                    <div>
                      <p className="font-medium">Notificaciones de Cobro</p>
                      <p className="text-sm text-neutral-500">Alertas cuando sea tu turno de cobrar</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.payoutNotifications}
                          onChange={() => handleNotificationChange('payoutNotifications')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  {/* New members toggle */}
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-medium">Nuevos Miembros</p>
                      <p className="text-sm text-neutral-500">Notificaciones cuando alguien se una a tu Pasanaku</p>
                    </div>
                    <div className="ml-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.newMembers}
                          onChange={() => handleNotificationChange('newMembers')}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </Card.Content>
              <Card.Footer>
                <Button
                  onClick={() => {
                    // In a real app, save notification preferences
                    alert('Preferencias de notificación guardadas');
                  }}
                >
                  Guardar Preferencias
                </Button>
              </Card.Footer>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;