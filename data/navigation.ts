import type { Language, NavLink, Category } from '@/types/common'

export const languages: Language[] = [
  { code: 'bn', label: 'Bangla', flag: '🇧🇩' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'ur', label: 'Urdu', flag: '🇵🇰' },
  { code: 'dh', label: 'Dhaka', flag: '🏙️' },
  { code: 'us', label: 'USA', flag: '🇺🇸' },
  { code: 'in', label: 'India', flag: '🇮🇳' },
]

export const navLinks: NavLink[] = [
  { label: 'Deals', href: '/deals' },
  { label: "What's New", href: '/new' },
  { label: 'Delivery', href: '/delivery' },
]

export const popularCategories: Category[] = [
  { id: 'furniture', name: 'Furniture',  itemCount: 240, icon: 'Armchair',    bgColor: '#FFF3E0', iconColor: '#E65100' },
  { id: 'handbag',   name: 'Hand Bag',   itemCount: 240, icon: 'ShoppingBag', bgColor: '#FCE4EC', iconColor: '#C62828' },
  { id: 'shoe',      name: 'Shoe',       itemCount: 240, icon: 'Footprints',  bgColor: '#E8F5E9', iconColor: '#2E7D32' },
  { id: 'headphone', name: 'Headphone',  itemCount: 240, icon: 'Headphones',  bgColor: '#E3F2FD', iconColor: '#1565C0' },
  { id: 'laptop',    name: 'Laptop',     itemCount: 240, icon: 'Laptop',      bgColor: '#F3E5F5', iconColor: '#6A1B9A' },
  { id: 'book',      name: 'Book',       itemCount: 240, icon: 'BookOpen',    bgColor: '#FFF8E1', iconColor: '#F57F17' },
]
