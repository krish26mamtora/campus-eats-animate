
import { MenuItem } from '../store/useCartStore';

export const menuItems: MenuItem[] = [
  // Snacks
  {
    id: '1',
    name: 'Crispy Samosa',
    description: 'Golden fried triangular pastry with spiced potato filling',
    price: 25,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&h=200&fit=crop',
    category: 'snacks',
    isVeg: true
  },
  {
    id: '2',
    name: 'Chicken Sandwich',
    description: 'Grilled chicken with fresh veggies in toasted bread',
    price: 65,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=300&h=200&fit=crop',
    category: 'snacks',
    isVeg: false
  },
  {
    id: '3',
    name: 'Masala Fries',
    description: 'Crispy potato fries tossed with Indian spices',
    price: 45,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop',
    category: 'snacks',
    isVeg: true
  },
  {
    id: '4',
    name: 'Paneer Roll',
    description: 'Spiced paneer wrapped in soft chapati with mint chutney',
    price: 55,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop',
    category: 'snacks',
    isVeg: true
  },

  // Main Course
  {
    id: '5',
    name: 'Rajma Rice Bowl',
    description: 'Creamy kidney bean curry served with basmati rice',
    price: 85,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop',
    category: 'main-course',
    isVeg: true
  },
  {
    id: '6',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice with tender chicken and aromatic spices',
    price: 120,
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop',
    category: 'main-course',
    isVeg: false
  },
  {
    id: '7',
    name: 'Dal Tadka with Roti',
    description: 'Yellow lentils tempered with cumin, served with wheat flatbread',
    price: 70,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
    category: 'main-course',
    isVeg: true
  },
  {
    id: '8',
    name: 'Pasta Arrabbiata',
    description: 'Penne pasta in spicy tomato sauce with herbs',
    price: 95,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
    category: 'main-course',
    isVeg: true
  },

  // Beverages
  {
    id: '9',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea with milk',
    price: 15,
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop',
    category: 'beverages',
    isVeg: true
  },
  {
    id: '10',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime juice with soda and mint',
    price: 30,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=300&h=200&fit=crop',
    category: 'beverages',
    isVeg: true
  },
  {
    id: '11',
    name: 'Mango Lassi',
    description: 'Creamy yogurt drink blended with sweet mango',
    price: 40,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&h=200&fit=crop',
    category: 'beverages',
    isVeg: true
  },
  {
    id: '12',
    name: 'Filter Coffee',
    description: 'South Indian style strong coffee with milk',
    price: 20,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
    category: 'beverages',
    isVeg: true
  }
];
