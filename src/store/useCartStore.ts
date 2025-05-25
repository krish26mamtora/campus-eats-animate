
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
    spiceLevel?: 'Low' | 'Medium' | 'High';
    addCheese?: boolean;
    portionSize?: 'Half' | 'Full';
    addExtraCurry?: boolean;
    sugarLevel?: 'No' | 'Low' | 'Normal';
    iceLevel?: 'No' | 'Normal' | 'Extra';
    addLemon?: boolean;
  };
  customizationPrice?: number;
}

export interface Order {
  id: string;
  orderId: string;
  items: CartItem[];
  total: number;
  timestamp: number;
  status: 'preparing' | 'ready' | 'completed';
  placedAt: string;
}

interface CartState {
  items: CartItem[];
  orders: Order[];
  addItem: (item: MenuItem) => void;
  addItemWithCustomization: (item: MenuItem, customizations: any) => void;
  updateQuantity: (id: string, quantity: number, customizations?: any) => void;
  removeItem: (id: string, customizations?: any) => void;
  clearCart: () => void;
  placeOrder: () => string;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const generateOrderId = () => {
  return 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const calculateCustomizationPrice = (customizations: any, category: string) => {
  let extraPrice = 0;
  
  if (category === 'snacks') {
    if (customizations.addCheese) extraPrice += 10;
  } else if (category === 'main-course') {
    if (customizations.portionSize === 'Half') extraPrice -= 20;
    if (customizations.addExtraCurry) extraPrice += 15;
  } else if (category === 'beverages') {
    if (customizations.addLemon) extraPrice += 5;
  }
  
  return extraPrice;
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

      addItemWithCustomization: (item, customizations) => {
        const items = get().items;
        const customizationPrice = calculateCustomizationPrice(customizations, item.category);
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
              customizationPrice 
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
      
      placeOrder: () => {
        const items = get().items;
        const total = get().getTotalPrice();
        const orderId = generateOrderId();
        const newOrder: Order = {
          id: Date.now().toString(),
          orderId,
          items: [...items],
          total,
          timestamp: Date.now(),
          status: 'preparing',
          placedAt: new Date().toISOString()
        };
        
        set({
          orders: [newOrder, ...get().orders],
          items: []
        });

        // Auto-update order status after 2 minutes
        setTimeout(() => {
          get().updateOrderStatus(orderId, 'ready');
        }, 120000); // 2 minutes

        return orderId;
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map(order =>
            order.orderId === orderId ? { ...order, status } : order
          )
        });
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
