
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MenuItem, useCartStore } from '../store/useCartStore';
import { toast } from 'sonner';

interface CustomizationOptions {
  // Snacks
  spiceLevel?: 'Low' | 'Medium' | 'High';
  addCheese?: boolean;
  noOnion?: boolean;
  extraChilli?: boolean;
  sauces?: string[];
  portionSize?: 'Regular' | 'Large';
  
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
  
  // Desserts
  sweetnessLevel?: 'Low' | 'Medium' | 'High';
  addIceCream?: boolean;
  serveTemperature?: 'Hot' | 'Cold';
  extraToppings?: string[];
  dessertPortion?: 'Slice' | 'Full';
}

interface CustomizationModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomizationModal = ({ item, isOpen, onClose }: CustomizationModalProps) => {
  const addItemWithCustomization = useCartStore(state => state.addItemWithCustomization);
  
  const [customizations, setCustomizations] = useState<CustomizationOptions>({
    // Snacks defaults
    spiceLevel: 'Medium',
    addCheese: false,
    noOnion: false,
    extraChilli: false,
    sauces: [],
    portionSize: 'Regular',
    
    // Main Course defaults
    excludeIngredients: [],
    addExtraGravy: false,
    addOns: [],
    addRaitaPapad: [],
    
    // Beverages defaults
    iceLevel: 'Normal',
    sugarLevel: 'Normal',
    addLemon: false,
    addMintGinger: [],
    cupSize: 'Medium',
    toppings: [],
    
    // Desserts defaults
    sweetnessLevel: 'Medium',
    addIceCream: false,
    serveTemperature: 'Cold',
    extraToppings: [],
    dessertPortion: 'Slice',
  });

  const calculateExtraPrice = () => {
    if (!item) return 0;
    let extraPrice = 0;
    
    if (item.category === 'snacks') {
      if (customizations.addCheese) extraPrice += 10;
      if (customizations.extraChilli) extraPrice += 5;
      if (customizations.portionSize === 'Large') extraPrice += 15;
      extraPrice += (customizations.sauces?.length || 0) * 3;
    } else if (item.category === 'main-course') {
      if (customizations.addExtraGravy) extraPrice += 15;
      extraPrice += (customizations.addOns?.length || 0) * 8;
      extraPrice += (customizations.addRaitaPapad?.length || 0) * 12;
    } else if (item.category === 'beverages') {
      if (customizations.cupSize === 'Large') extraPrice += 10;
      if (customizations.cupSize === 'Small') extraPrice -= 5;
      extraPrice += (customizations.toppings?.length || 0) * 5;
      extraPrice += (customizations.addMintGinger?.length || 0) * 3;
    }
    
    return extraPrice;
  };

  const handleArrayToggle = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const handleAddToCart = () => {
    if (!item) return;
    
    const relevantCustomizations: any = {};
    const extraPrice = calculateExtraPrice();
    
    if (item.category === 'snacks') {
      relevantCustomizations.spiceLevel = customizations.spiceLevel;
      relevantCustomizations.addCheese = customizations.addCheese;
      relevantCustomizations.noOnion = customizations.noOnion;
      relevantCustomizations.extraChilli = customizations.extraChilli;
      relevantCustomizations.sauces = customizations.sauces;
      relevantCustomizations.portionSize = customizations.portionSize;
    } else if (item.category === 'main-course') {
      relevantCustomizations.spiceLevel = customizations.spiceLevel;
      relevantCustomizations.excludeIngredients = customizations.excludeIngredients;
      relevantCustomizations.addExtraGravy = customizations.addExtraGravy;
      relevantCustomizations.portionSize = customizations.portionSize;
      relevantCustomizations.addOns = customizations.addOns;
      relevantCustomizations.addRaitaPapad = customizations.addRaitaPapad;
    } else if (item.category === 'beverages') {
      relevantCustomizations.iceLevel = customizations.iceLevel;
      relevantCustomizations.sugarLevel = customizations.sugarLevel;
      relevantCustomizations.addLemon = customizations.addLemon;
      relevantCustomizations.addMintGinger = customizations.addMintGinger;
      relevantCustomizations.cupSize = customizations.cupSize;
      relevantCustomizations.toppings = customizations.toppings;
    }

    addItemWithCustomization(item, relevantCustomizations, extraPrice);
    toast.success(`${item.name} added to cart with customizations!`);
    onClose();
  };

  const renderSnacksOptions = () => (
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Portion Size</label>
        <div className="flex space-x-3">
          {['Regular', 'Large'].map((size) => (
            <button
              key={size}
              onClick={() => setCustomizations(prev => ({ ...prev, portionSize: size as any }))}
              className={`px-4 py-2 rounded-lg border ${
                customizations.portionSize === size
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
              }`}
            >
              {size} {size === 'Large' ? '(+₹15)' : ''}
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

      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={customizations.noOnion}
            onChange={(e) => setCustomizations(prev => ({ ...prev, noOnion: e.target.checked }))}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">No Onion</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={customizations.extraChilli}
            onChange={(e) => setCustomizations(prev => ({ ...prev, extraChilli: e.target.checked }))}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">Extra Chilli (+₹5)</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Sauces (+₹3 each)</label>
        <div className="space-y-2">
          {['Mayo', 'Tandoori Sauce', 'Mint Chutney', 'Tomato Ketchup'].map((sauce) => (
            <label key={sauce} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customizations.sauces?.includes(sauce)}
                onChange={() => handleArrayToggle(
                  customizations.sauces || [], 
                  sauce, 
                  (value) => setCustomizations(prev => ({ ...prev, sauces: value }))
                )}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{sauce}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  const renderMainCourseOptions = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
        <div className="flex space-x-3">
          {['Mild', 'Medium', 'Spicy'].map((level) => (
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Exclude Ingredients</label>
        <div className="space-y-2">
          {['No Onion', 'No Garlic', 'No Tomato', 'No Ginger'].map((ingredient) => (
            <label key={ingredient} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customizations.excludeIngredients?.includes(ingredient)}
                onChange={() => handleArrayToggle(
                  customizations.excludeIngredients || [], 
                  ingredient, 
                  (value) => setCustomizations(prev => ({ ...prev, excludeIngredients: value }))
                )}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{ingredient}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={customizations.addExtraGravy}
            onChange={(e) => setCustomizations(prev => ({ ...prev, addExtraGravy: e.target.checked }))}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">Add Extra Gravy (+₹15)</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Add-ons (+₹8 each)</label>
        <div className="space-y-2">
          {['Extra Ghee', 'Extra Masala', 'Butter Topping'].map((addon) => (
            <label key={addon} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customizations.addOns?.includes(addon)}
                onChange={() => handleArrayToggle(
                  customizations.addOns || [], 
                  addon, 
                  (value) => setCustomizations(prev => ({ ...prev, addOns: value }))
                )}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{addon}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Raita/Papad (+₹12 each)</label>
        <div className="space-y-2">
          {['Raita', 'Papad', 'Pickle'].map((item) => (
            <label key={item} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customizations.addRaitaPapad?.includes(item)}
                onChange={() => handleArrayToggle(
                  customizations.addRaitaPapad || [], 
                  item, 
                  (value) => setCustomizations(prev => ({ ...prev, addRaitaPapad: value }))
                )}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{item}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  const renderBeveragesOptions = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cup Size</label>
        <div className="flex space-x-3">
          {['Small', 'Medium', 'Large'].map((size) => (
            <button
              key={size}
              onClick={() => setCustomizations(prev => ({ ...prev, cupSize: size as any }))}
              className={`px-4 py-2 rounded-lg border ${
                customizations.cupSize === size
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-orange-300'
              }`}
            >
              {size} {size === 'Small' ? '(-₹5)' : size === 'Large' ? '(+₹10)' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sugar Level</label>
        <div className="flex space-x-3">
          {['No Sugar', 'Less', 'Normal', 'Extra'].map((level) => (
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
          {['No Ice', 'Normal', 'Extra Ice'].map((level) => (
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Mint/Ginger (+₹3 each)</label>
        <div className="space-y-2">
          {['Fresh Mint', 'Ginger', 'Basil'].map((herb) => (
            <label key={herb} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customizations.addMintGinger?.includes(herb)}
                onChange={() => handleArrayToggle(
                  customizations.addMintGinger || [], 
                  herb, 
                  (value) => setCustomizations(prev => ({ ...prev, addMintGinger: value }))
                )}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{herb}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Toppings (+₹5 each)</label>
        <div className="space-y-2">
          {['Basil Seeds', 'Chia Seeds', 'Coconut Flakes', 'Honey Drizzle'].map((topping) => (
            <label key={topping} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={customizations.toppings?.includes(topping)}
                onChange={() => handleArrayToggle(
                  customizations.toppings || [], 
                  topping, 
                  (value) => setCustomizations(prev => ({ ...prev, toppings: value }))
                )}
                className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">{topping}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );

  const renderCustomizationOptions = () => {
    if (!item) return null;

    switch (item.category) {
      case 'snacks':
        return renderSnacksOptions();
      case 'main-course':
        return renderMainCourseOptions();
      case 'beverages':
        return renderBeveragesOptions();
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
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-colors duration-300"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Customize Your Order</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
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
                    <h3 className="font-medium text-gray-800 dark:text-white">{item.name}</h3>
                    <p className="text-orange-600 dark:text-orange-400 font-bold">₹{item.price + calculateExtraPrice()}</p>
                    {calculateExtraPrice() > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">Base: ₹{item.price} + Extras: ₹{calculateExtraPrice()}</p>
                    )}
                  </div>
                </div>

                {renderCustomizationOptions()}

                <div className="flex space-x-3 pt-4 border-t dark:border-gray-700">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleAddToCart}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart - ₹{item.price + calculateExtraPrice()}
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
