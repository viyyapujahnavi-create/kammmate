import React from 'react';
import {
  ShoppingBag,
  Printer,
  Home,
  Package,
  HeartHandshake,
  Bike,
  Wrench,
  Zap,
  Laptop,
  Sprout,
  GraduationCap,
  PawPrint,
  HelpCircle,
  type LucideProps
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Printer':
      return <Printer {...props} />;
    case 'Home':
      return <Home {...props} />;
    case 'Package':
      return <Package {...props} />;
    case 'HeartHandshake':
      return <HeartHandshake {...props} />;
    case 'Bike':
      return <Bike {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Laptop':
      return <Laptop {...props} />;
    case 'Sprout':
      return <Sprout {...props} />;
    case 'GraduationCap':
      return <GraduationCap {...props} />;
    case 'PawPrint':
      return <PawPrint {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
};
