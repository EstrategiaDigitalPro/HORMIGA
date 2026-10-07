import React from 'react';
import {
  Home,
  Utensils,
  Car,
  Zap,
  HeartPulse,
  Gamepad2,
  Layers,
  ShoppingBag,
  Flame,
  Receipt,
} from 'lucide-react';

export function getCategoryIcon(iconOrName: string, isHormiga?: boolean): React.ReactNode {
  if (isHormiga) {
    return <Flame className="w-4 h-4 text-[#F4A340] fill-[#F4A340]" />;
  }

  const key = iconOrName.toLowerCase();

  switch (key) {
    case 'home':
    case 'vivienda':
      return <Home className="w-4 h-4 text-[#176B45]" />;
    case 'utensils':
    case 'alimentación':
    case 'alimentacion':
      return <Utensils className="w-4 h-4 text-[#2563EB]" />;
    case 'car':
    case 'transporte':
      return <Car className="w-4 h-4 text-[#0891B2]" />;
    case 'zap':
    case 'servicios':
      return <Zap className="w-4 h-4 text-[#8B5CF6]" />;
    case 'heartpulse':
    case 'salud':
      return <HeartPulse className="w-4 h-4 text-[#EC4899]" />;
    case 'gamepad2':
    case 'entretenimiento':
      return <Gamepad2 className="w-4 h-4 text-[#F59E0B]" />;
    case 'shoppingbag':
    case 'compras':
      return <ShoppingBag className="w-4 h-4 text-[#C97E25]" />;
    case 'receipt':
      return <Receipt className="w-4 h-4 text-[#68716B]" />;
    default:
      return <Layers className="w-4 h-4 text-[#68716B]" />;
  }
}
