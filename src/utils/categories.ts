import {
  Utensils,
  ShoppingBag,
  FileText,
  Car,
  Heart,
  Film,
  GraduationCap,
  Plane,
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { CategoryType } from '../types';

export interface CategoryMeta {
  name: CategoryType;
  icon: LucideIcon;
  color: string;       // Tailwind text/bg color helper
  hex: string;         // Hex color for Recharts custom strokes
  gradient: string;    // Gradient start-stop class
}

export const CATEGORIES: Record<CategoryType, CategoryMeta> = {
  Food: {
    name: 'Food',
    icon: Utensils,
    color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    hex: '#FBBF24',
    gradient: 'from-amber-400/20 to-amber-600/5',
  },
  Shopping: {
    name: 'Shopping',
    icon: ShoppingBag,
    color: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    hex: '#F472B6',
    gradient: 'from-pink-400/20 to-pink-600/5',
  },
  Bills: {
    name: 'Bills',
    icon: FileText,
    color: 'text-red-400 bg-red-400/10 border-red-400/20',
    hex: '#F87171',
    gradient: 'from-red-400/20 to-red-600/5',
  },
  Transport: {
    name: 'Transport',
    icon: Car,
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    hex: '#60A5FA',
    gradient: 'from-blue-400/20 to-blue-600/5',
  },
  Health: {
    name: 'Health',
    icon: Heart,
    color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    hex: '#34D399',
    gradient: 'from-emerald-400/20 to-emerald-600/5',
  },
  Entertainment: {
    name: 'Entertainment',
    icon: Film,
    color: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    hex: '#C084FC',
    gradient: 'from-purple-400/20 to-purple-600/5',
  },
  Education: {
    name: 'Education',
    icon: GraduationCap,
    color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    hex: '#818CF8',
    gradient: 'from-indigo-400/20 to-indigo-600/5',
  },
  Travel: {
    name: 'Travel',
    icon: Plane,
    color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    hex: '#22D3EE',
    gradient: 'from-cyan-400/20 to-cyan-600/5',
  },
  Other: {
    name: 'Other',
    icon: HelpCircle,
    color: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
    hex: '#9CA3AF',
    gradient: 'from-gray-400/20 to-gray-600/5',
  },
};
