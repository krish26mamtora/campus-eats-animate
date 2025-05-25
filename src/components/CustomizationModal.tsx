
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MenuItem, useCartStore } from '../store/useCartStore';
import { toast } from 'sonner';

interface CustomizationOptions {
  spiceLevel?: 'Low' | 'Medium' | 'High';
  addCheese?: boolean;
  portionSize?: 'Half' | 'Full';
  addExtraCurry?: boolean;
  sugarLevel?: 'No' | 'Low' | 'Normal';
  iceLevel?: 'No' | 'Normal' | 'Extra';
  addLemon?: boolean;
}

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomizationModal = ({ item, isOpen, onClose }: CustomizationModalProps) => {
  const addItemWithCustomization = useCartStore(state => state.addItemWithCustomization);
  
  const [customizations, setCustomizations] = useState<CustomizationOptions>({
    spiceLevel: 'Medium',
    addCheese: false,
    portionSize: 'Full',
    addExtraCurry: false,
    sugarLevel: 'Normal',
    iceLevel: 'Normal',
    addLemon: false,
  });

  const handleAddToCart = () => {
    if (!item) return;
    
    // Filter customizations based on category
    const relevantCustomizations: any = {};
    
    if (item.category === 'snacks') {
      relevantCustomizations.spiceLevel = customizations.spiceLevel;
      relevantCustomizations.addCheese = customizations.addCheese;
    } else if (item.category === 'main-course') {
      relevantCustomizations.portionSize = customizations.portionSize;
      relevantCustomizations.spiceLevel = customizations.spiceLevel;
      relevantCustomizations.addExtraCurry = customizations.addExtraCurry;
    } else if (item.category === 'beverages') {
      relevantCustomizations.sugarLevel = customizations.sugarLevel;
      relevantCustomizations.iceLevel = customizations.iceLevel;
      relevantCustomizations.addLemon = customizations.addLemon;
    }

    addItemWithCustomization(item, relevantCustomizations);
    toast.success(`${item.name} added to cart with customizations!`);
    onClose();
  };

  const renderCustomizationOptions = () => {
    if (!item) return null;

    switch (item.category) {
      case 'snacks':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
              <div className="flex space-x-3">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setCustomizations(prev => ({ ...prev, spiceLevel: level as any }))}
                    className={`px-4 py-2 rounded-lg border ${
                      customizations.spiceLevel === level
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customizations.addCheese}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, addCheese: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Add Cheese (+₹10)</span>
              </label>
            </div>
          </>
        );

      case 'main-course':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Portion Size</label>
              <div className="flex space-x-3">
                {['Half', 'Full'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setCustomizations(prev => ({ ...prev, portionSize: size as any }))}
                    className={`px-4 py-2 rounded-lg border ${
                      customizations.portionSize === size
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {size} {size === 'Half' ? '(-₹20)' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
              <div className="flex space-x-3">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setCustomizations(prev => ({ ...prev, spiceLevel: level as any }))}
                    className={`px-4 py-2 rounded-lg border ${
                      customizations.spiceLevel === level
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customizations.addExtraCurry}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, addExtraCurry: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Add Extra Curry (+₹15)</span>
              </label>
            </div>
          </>
        );

      case 'beverages':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sugar Level</label>
              <div className="flex space-x-3">
                {['No', 'Low', 'Normal'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setCustomizations(prev => ({ ...prev, sugarLevel: level as any }))}
                    className={`px-4 py-2 rounded-lg border ${
                      customizations.sugarLevel === level
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ice Level</label>
              <div className="flex space-x-3">
                {['No', 'Normal', 'Extra'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setCustomizations(prev => ({ ...prev, iceLevel: level as any }))}
                    className={`px-4 py-2 rounded-lg border ${
                      customizations.iceLevel === level
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={customizations.addLemon}
                  onChange={(e) => setCustomizations(prev => ({ ...prev, addLemon: e.target.checked }))}
                  className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Add Lemon (+₹5)</span>
              </label>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && item && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Customize Your Order</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-orange-600 font-bold">₹{item.price}</p>
                  </div>
                </div>

                {renderCustomizationOptions()}

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleAddToCart}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CustomizationModal;
