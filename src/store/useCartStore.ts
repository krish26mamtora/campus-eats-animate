import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'snacks' | 'main-course' | 'beverages';
  isVeg: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
  customizations?: {
    // Snacks
    spiceLevel?: 'Low' | 'Medium' | 'High' | 'Mild' | 'Spicy';
    addCheese?: boolean;
    noOnion?: boolean;
    extraChilli?: boolean;
    sauces?: string[];
    portionSize?: 'Regular' | 'Large' | 'Half' | 'Full';
    
    // Main Course
    excludeIngredients?: string[];
    addExtraGravy?: boolean;
    addOns?: string[];
    addRaitaPapad?: string[];
    
    // Beverages
    iceLevel?: 'No Ice' | 'Normal' | 'Extra Ice';
    sugarLevel?: 'No Sugar' | 'Less' | 'Normal' | 'Extra';
    addLemon?: boolean;
    addMintGinger?: string[];
    cupSize?: 'Small' | 'Medium' | 'Large';
    toppings?: string[];
  };
  customizationPrice?: number;
}

export interface Order {
  id: string;
  orderId: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  status: 'placed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered' | 'cancelled';
  placedAt: string;
  estimatedTime?: number;
  deliveryAddress?: string;
  paymentMethod?: 'cash' | 'card' | 'upi';
  rating?: number;
  feedback?: string;
}

interface CartState {
  items: CartItem[];
  orders: Order[];
  addItem: (item: MenuItem) => void;
  addItemWithCustomization: (item: MenuItem, customizations: any, extraPrice?: number) => void;
  updateQuantity: (id: string, quantity: number, customizations?: any) => void;
  removeItem: (id: string, customizations?: any) => void;
  clearCart: () => void;
  placeOrder: (deliveryAddress?: string, paymentMethod?: string) => string;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  cancelOrder: (orderId: string) => void;
  reorderItems: (orderId: string) => void;
  rateOrder: (orderId: string, rating: number, feedback?: string) => void;
  markOrderReceived: (orderId: string) => void;
  generateDummyOrders: () => void;
}

const generateOrderId = () => {
  return 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const getCartItemKey = (item: MenuItem, customizations?: any) => {
  return `${item.id}_${JSON.stringify(customizations || {})}`;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orders: [],
      
      addItem: (item) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(cartItem => 
          cartItem.id === item.id && !cartItem.customizations
        );
        
        if (existingItemIndex >= 0) {
          set({
            items: items.map((cartItem, index) =>
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      addItemWithCustomization: (item, customizations, extraPrice = 0) => {
        const items = get().items;
        const itemKey = getCartItemKey(item, customizations);
        
        const existingItemIndex = items.findIndex(cartItem => 
          getCartItemKey(cartItem, cartItem.customizations) === itemKey
        );
        
        if (existingItemIndex >= 0) {
          set({
            items: items.map((cartItem, index) =>
              index === existingItemIndex
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          });
        } else {
          set({ 
            items: [...items, { 
              ...item, 
              quantity: 1, 
              customizations,
              customizationPrice: extraPrice 
            }] 
          });
        }
      },
      
      updateQuantity: (id, quantity, customizations) => {
        if (quantity <= 0) {
          get().removeItem(id, customizations);
          return;
        }
        
        const itemKey = getCartItemKey({ id } as MenuItem, customizations);
        set({
          items: get().items.map(item => {
            const currentItemKey = getCartItemKey(item, item.customizations);
            return currentItemKey === itemKey ? { ...item, quantity } : item;
          })
        });
      },
      
      removeItem: (id, customizations) => {
        const itemKey = getCartItemKey({ id } as MenuItem, customizations);
        set({ 
          items: get().items.filter(item => {
            const currentItemKey = getCartItemKey(item, item.customizations);
            return currentItemKey !== itemKey;
          })
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      placeOrder: (deliveryAddress = "Campus Hostel Block A", paymentMethod = "upi") => {
        const items = get().items;
        const total = get().getTotalPrice();
        const orderId = generateOrderId();
        const newOrder: Order = {
          id: Date.now().toString(),
          orderId,
          items: [...items],
          total,
          timestamp: Date.now(),
          status: 'placed',
          placedAt: new Date().toISOString(),
          estimatedTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
          deliveryAddress,
          paymentMethod: paymentMethod as any
        };
        
        set({
          orders: [newOrder, ...get().orders],
          items: []
        });

        // Auto-update order status progression
        setTimeout(() => {
          get().updateOrderStatus(orderId, 'preparing');
        }, 30000); // 30 seconds

        setTimeout(() => {
          get().updateOrderStatus(orderId, 'ready');
        }, 120000); // 2 minutes

        setTimeout(() => {
          get().updateOrderStatus(orderId, 'out-for-delivery');
        }, 180000); // 3 minutes

        return orderId;
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(order =>
            order.orderId === orderId ? { ...order, status } : order
          )
        });
      },

      cancelOrder: (orderId) => {
        set({
          orders: get().orders.map(order =>
            order.orderId === orderId ? { ...order, status: 'cancelled' } : order
          )
        });
      },

      reorderItems: (orderId) => {
        const order = get().orders.find(o => o.orderId === orderId);
        if (order) {
          set({ items: [...order.items] });
        }
      },

      rateOrder: (orderId, rating, feedback) => {
        set({
          orders: get().orders.map(order =>
            order.orderId === orderId ? { ...order, rating, feedback } : order
          )
        });
      },

      markOrderReceived: (orderId) => {
        set({
          orders: get().orders.map(order =>
            order.orderId === orderId ? { ...order, status: 'delivered' } : order
          )
        });
      },

      generateDummyOrders: () => {
        const dummyOrders: Order[] = [
          {
            id: '1',
            orderId: 'ORD123ABC',
            items: [
              {
                id: '1',
                name: 'Veg Burger',
                description: 'Delicious veggie burger',
                price: 80,
                image: '/placeholder.svg',
                category: 'snacks',
                isVeg: true,
                quantity: 2,
                customizations: { spiceLevel: 'Medium', addCheese: true }
              }
            ],
            total: 170,
            timestamp: Date.now() - 86400000, // 1 day ago
            status: 'delivered',
            placedAt: new Date(Date.now() - 86400000).toISOString(),
            estimatedTime: 25,
            deliveryAddress: 'Campus Hostel Block A',
            paymentMethod: 'upi',
            rating: 5
          },
          {
            id: '2',
            orderId: 'ORD456DEF',
            items: [
              {
                id: '2',
                name: 'Paneer Tikka',
                description: 'Grilled paneer cubes',
                price: 120,
                image: '/placeholder.svg',
                category: 'main-course',
                isVeg: true,
                quantity: 1,
                customizations: { spiceLevel: 'Spicy', portionSize: 'Full' }
              }
            ],
            total: 120,
            timestamp: Date.now() - 172800000, // 2 days ago
            status: 'delivered',
            placedAt: new Date(Date.now() - 172800000).toISOString(),
            estimatedTime: 35,
            deliveryAddress: 'Campus Library',
            paymentMethod: 'cash',
            rating: 4
          },
          {
            id: '3',
            orderId: 'ORD789GHI',
            items: [
              {
                id: '3',
                name: 'Masala Chai',
                description: 'Hot spiced tea',
                price: 20,
                image: '/placeholder.svg',
                category: 'beverages',
                isVeg: true,
                quantity: 3,
                customizations: { sugarLevel: 'Normal', cupSize: 'Medium' }
              }
            ],
            total: 60,
            timestamp: Date.now() - 259200000, // 3 days ago
            status: 'delivered',
            placedAt: new Date(Date.now() - 259200000).toISOString(),
            estimatedTime: 10,
            deliveryAddress: 'Campus Canteen',
            paymentMethod: 'card'
          }
        ];
        
        set({ orders: [...dummyOrders, ...get().orders] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const basePrice = item.price * item.quantity;
          const customizationPrice = (item.customizationPrice || 0) * item.quantity;
          return total + basePrice + customizationPrice;
        }, 0);
      }
    }),
    {
      name: 'campus-canteen-storage'
    }
  )
);
