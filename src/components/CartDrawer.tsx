import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { toast } from 'sonner';
import OrderConfirmationModal from './OrderConfirmationModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeItem, clearCart, placeOrder, getTotalPrice } = useCartStore();
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    orderId: string;
  }>({ isOpen: false, orderId: '' });

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    
    const orderId = placeOrder();
    setConfirmationModal({ isOpen: true, orderId });
    onClose();
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, orderId: '' });
  };

  const getItemDisplayPrice = (item: any) => {
    const basePrice = item.price;
    const customizationPrice = item.customizationPrice || 0;
    return basePrice + customizationPrice;
  };

  const formatCustomizations = (customizations: any) => {
    if (!customizations) return '';
    
    const parts = [];
    if (customizations.spiceLevel) parts.push(`${customizations.spiceLevel} Spice`);
    if (customizations.addCheese) parts.push('Extra Cheese');
    if (customizations.portionSize) parts.push(`${customizations.portionSize} Portion`);
    if (customizations.addExtraCurry) parts.push('Extra Curry');
    if (customizations.sugarLevel) parts.push(`${customizations.sugarLevel} Sugar`);
    if (customizations.iceLevel) parts.push(`${customizations.iceLevel} Ice`);
    if (customizations.addLemon) parts.push('With Lemon');
    
    return parts.join(', ');
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            <motion.div
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto transition-colors duration-300"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Your Cart</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Your cart is empty</p>
                    <p className="text-gray-400 dark:text-gray-500">Add some delicious items from our menu!</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {items.map((item, index) => (
                        <motion.div
                          key={`${item.id}_${JSON.stringify(item.customizations)}_${index}`}
                          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 dark:text-white">{item.name}</h4>
                              <p className="text-orange-600 font-bold">₹{getItemDisplayPrice(item)}</p>
                              
                              {item.customizations && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {formatCustomizations(item.customizations)}
                                </p>
                              )}
                              
                              <div className="flex items-center space-x-3 mt-2">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.customizations)}
                                    className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  
                                  <span className="w-8 text-center font-medium dark:text-white">{item.quantity}</span>
                                  
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.customizations)}
                                    className="p-1 hover:bg-white dark:hover:bg-gray-700 rounded transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => removeItem(item.id, item.customizations)}
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 rounded transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-bold text-gray-800 dark:text-white">₹{getItemDisplayPrice(item) * item.quantity}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-bold text-gray-800 dark:text-white">Total</span>
                        <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{getTotalPrice()}</span>
                      </div>
                      
                      <div className="space-y-3">
                        <motion.button
                          onClick={handlePlaceOrder}
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-bold text-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Place Order
                        </motion.button>
                        
                        <button
                          onClick={clearCart}
                          className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          Clear Cart
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <OrderConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={closeConfirmationModal}
        orderId={confirmationModal.orderId}
      />
    </>
  );
};

export default CartDrawer;
