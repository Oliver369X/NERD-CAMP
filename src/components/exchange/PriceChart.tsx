import React, { useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useExchangeStore } from '../../stores/exchangeStore';
import Card from '../ui/Card';

const formatBOB = (amount: number) => {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const PriceChart: React.FC = () => {
  const { rates, fetchRates, isLoading } = useExchangeStore();
  
  useEffect(() => {
    fetchRates();
  }, [fetchRates]);
  
  if (isLoading) {
    return (
      <Card>
        <Card.Content className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </Card.Content>
      </Card>
    );
  }
  
  return (
    <Card>
      <Card.Header>
        <div className="text-center">
          <Card.Title>Tipo de Cambio BOB/USDT</Card.Title>
          {rates.length > 0 && (
            <div className="mt-4">
              <p className="text-4xl font-bold text-primary-600">
                {formatBOB(rates[rates.length - 1].rate)}
              </p>
              <p className="text-sm text-neutral-500 mt-1">por 1 USDT</p>
            </div>
          )}
        </div>
        <Card.Description className="text-center mt-2">
          Precio actual de Binance P2P
        </Card.Description>
      </Card.Header>
    </Card>
  );
};

export default PriceChart;