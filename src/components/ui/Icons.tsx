import React from 'react';
import { CoinsIcon as LucideCoinsIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface IconProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

// Re-export Lucide icons with consistent styling
export const CoinsIcon: React.FC<IconProps> = ({ className, ...props }) => {
  return <LucideCoinsIcon className={cn('', className)} {...props} />;
};