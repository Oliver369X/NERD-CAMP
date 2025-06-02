import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Landmark, RefreshCw, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWalletStore } from '../stores/walletStore';
import Button from '../components/ui/Button';
import { CoinsIcon } from '../components/ui/Icons';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useWalletStore();
  
  // If user is already connected, redirect to dashboard
  useEffect(() => {
    if (isConnected) {
      navigate('/dashboard');
    }
  }, [isConnected, navigate]);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-neutral-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight mb-6">
                Protege tus ahorros de la devaluación con Pasanakus en <span className="text-primary-600">USDT</span>
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                Pasacoin es la primera plataforma que combina la tradición de los Pasanakus bolivianos con la estabilidad de la tecnología blockchain.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Cómo Funciona
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                  onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Comenzar Ahora
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/5849578/pexels-photo-5849578.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Pasacoin platform" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-36 h-36 bg-accent-500 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary-500 rounded-full opacity-20 blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">El Problema</h2>
            <p className="text-lg text-neutral-700">
              La reciente crisis de devaluación en Bolivia ha afectado seriamente los ahorros tradicionales. 
              Los Pasanakus convencionales, aunque populares, no están protegidos contra la pérdida de valor del boliviano.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md"
            >
              <img 
                src="https://images.pexels.com/photos/3943746/pexels-photo-3943746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Depreciación del boliviano" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Depreciación del boliviano</h3>
                <p className="text-neutral-600">
                  El boliviano ha perdido más del 20% de su valor frente al dólar en el último año, 
                  afectando negativamente a todos los ahorros en moneda local.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-md"
            >
              <img 
                src="https://images.pexels.com/photos/6802048/pexels-photo-6802048.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Pasanakus tradicionales en riesgo" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">Pasanakus tradicionales en riesgo</h3>
                <p className="text-neutral-600">
                  Los ahorros colectivos en Pasanakus tradicionales pierden poder adquisitivo mientras 
                  esperan su turno para recibir el pozo.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">Nuestra Solución</h2>
            <p className="text-lg text-neutral-700">
              Pasacoin combina la tradición de los Pasanakus con la estabilidad de las criptomonedas 
              estables (stablecoins) y la seguridad de la tecnología blockchain.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Protección contra la devaluación</h3>
              <p className="text-neutral-600">
                Al usar USDT, tus ahorros mantienen su valor frente al dólar, 
                protegiéndote de la devaluación del boliviano.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Landmark className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Respaldo tecnológico</h3>
              <p className="text-neutral-600">
                Contratos inteligentes en la blockchain de Polkadot garantizan la 
                seguridad y transparencia de cada transacción.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Automatización completa</h3>
              <p className="text-neutral-600">
                El sistema gestiona automáticamente las contribuciones, los turnos 
                y los pagos sin necesidad de intermediarios.
              </p>
            </motion.div>
            
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary-700" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Comunidad confiable</h3>
              <p className="text-neutral-600">
                Únete a Pasanakus públicos o crea los tuyos con amigos y 
                familiares, con total seguridad y transparencia.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Steps */}
      <section className="py-16 bg-gradient-to-b from-neutral-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">¿Cómo Funciona?</h2>
            <p className="text-lg text-neutral-700">
              Comenzar con Pasacoin es fácil y seguro. Sigue estos sencillos pasos:
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Step 1 */}
            <motion.div 
              className="flex flex-col md:flex-row items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <div className="bg-primary-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-4">
                  1
                </div>
                <h3 className="text-2xl font-semibold mb-3">Conecta tu billetera</h3>
                <p className="text-neutral-600">
                  Conecta tu billetera Web3 compatible con Polkadot (como Talisman o SubWallet) 
                  o usa MetaMask con PVM (Polkadot Virtual Machine).
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-neutral-200">
                  <img 
                    src="https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Conectar billetera" 
                    className="w-full h-52 object-cover object-center" 
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              className="flex flex-col md:flex-row-reverse items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
                <div className="bg-primary-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-4">
                  2
                </div>
                <h3 className="text-2xl font-semibold mb-3">Crea o únete a un Pasanaku</h3>
                <p className="text-neutral-600">
                  Inicia tu propio Pasanaku definiendo el monto, frecuencia y número de participantes, 
                  o únete a uno existente de nuestra comunidad.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-neutral-200">
                  <img 
                    src="https://images.pexels.com/photos/7648057/pexels-photo-7648057.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Crear o unirse a Pasanaku" 
                    className="w-full h-52 object-cover object-center" 
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              className="flex flex-col md:flex-row items-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <div className="bg-primary-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-4">
                  3
                </div>
                <h3 className="text-2xl font-semibold mb-3">Contribuye con USDT</h3>
                <p className="text-neutral-600">
                  Realiza tus aportes en USDT según la frecuencia establecida. La plataforma 
                  te notificará cuando sea tu turno de pagar.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-neutral-200">
                  <img 
                    src="https://images.pexels.com/photos/7876429/pexels-photo-7876429.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Contribuir con USDT" 
                    className="w-full h-52 object-cover object-center" 
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Step 4 */}
            <motion.div 
              className="flex flex-col md:flex-row-reverse items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
                <div className="bg-primary-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold text-xl mb-4">
                  4
                </div>
                <h3 className="text-2xl font-semibold mb-3">Recibe el pozo cuando sea tu turno</h3>
                <p className="text-neutral-600">
                  Cuando llegue tu turno, recibirás automáticamente el pozo completo en USDT 
                  directamente en tu billetera.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-neutral-200">
                  <img 
                    src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                    alt="Recibir pozo de Pasanaku" 
                    className="w-full h-52 object-cover object-center" 
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-primary-900" id="get-started">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-8">
                <CoinsIcon size={64} className="text-primary-200" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Comienza a ahorrar con valor protegido hoy mismo
              </h2>
              <p className="text-xl text-primary-200 mb-8">
                Únete a la revolución de los ahorros colectivos en Bolivia. 
                Protege tu dinero contra la devaluación con Pasacoin.
              </p>
              <Button 
                size="lg"
                className="bg-white text-primary-700 hover:bg-primary-50"
                onClick={() => connectWallet()}
              >
                Conecta tu Billetera para Empezar
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16" id="faq">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-6">Preguntas Frecuentes</h2>
            <p className="text-lg text-neutral-700">
              Resolvemos tus dudas sobre Pasacoin, los Pasanakus y la tecnología blockchain.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  question: "¿Qué es un Pasanaku?",
                  answer: "Un Pasanaku es un sistema tradicional de ahorro colectivo en Bolivia, donde un grupo de personas aporta una cantidad fija periódicamente. Cada participante recibe el monto total recaudado por turno."
                },
                {
                  question: "¿Qué es USDT y por qué lo usamos?",
                  answer: "USDT (Tether) es una criptomoneda estable (stablecoin) cuyo valor está anclado al dólar estadounidense. Utilizamos USDT para proteger los ahorros de la devaluación del boliviano."
                },
                {
                  question: "¿Necesito conocimientos de criptomonedas para usar Pasacoin?",
                  answer: "No, Pasacoin está diseñado para ser fácil de usar incluso si nunca has usado criptomonedas antes. Nuestra interfaz es intuitiva y ofrecemos guías paso a paso."
                },
                {
                  question: "¿Cómo puedo obtener USDT para participar?",
                  answer: "Puedes comprar USDT a través de nuestra función de compra con bolivianos, o transferirlo desde otra billetera o exchange si ya tienes."
                },
                {
                  question: "¿Es seguro guardar mi dinero en un Pasanaku de Pasacoin?",
                  answer: "Sí, los fondos están protegidos por contratos inteligentes en la blockchain, lo que significa que nadie puede manipular las reglas del Pasanaku o acceder a los fondos fuera de las condiciones establecidas."
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200"
                >
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-neutral-600">{faq.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;