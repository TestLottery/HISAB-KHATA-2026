import React from 'react';
import {
  Briefcase,
  Store,
  Laptop,
  TrendingUp,
  Gift,
  PlusCircle,
  Utensils,
  Bus,
  ShoppingBag,
  Receipt,
  HeartPulse,
  GraduationCap,
  Home,
  Film,
  MinusCircle,
  CircleDot,
} from 'lucide-react';

interface Props {
  iconName: string;
  className?: string;
}

export const CategoryIcon: React.FC<Props> = ({ iconName, className = 'w-5 h-5' }) => {
  switch (iconName) {
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Store':
      return <Store className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Gift':
      return <Gift className={className} />;
    case 'PlusCircle':
      return <PlusCircle className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Bus':
      return <Bus className={className} />;
    case 'ShoppingBag':
      return <ShoppingBag className={className} />;
    case 'Receipt':
      return <Receipt className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Film':
      return <Film className={className} />;
    case 'MinusCircle':
      return <MinusCircle className={className} />;
    default:
      return <CircleDot className={className} />;
  }
};
