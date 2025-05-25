import { useState } from 'react';
import { motion } from 'framer-motion';
import { menuItems } from '../data/menuData';
import MenuCard from '../components/MenuCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import CartIcon from '../components/CartIcon';
import CartDrawer from '../components/CartDrawer';
import CustomizationModal from '../components/CustomizationModal';
import { MenuItem } from '../store/useCartStore';

const categories = [
  { key: 'all', label: 'All Items', icon: '🍽️' },
  { key: 'snacks', label: 'Snacks', icon: '🍿' },
  { key: 'main-course', label: 'Main Course', icon: '🍛' },
  { key: 'beverages', label: 'Beverages', icon: '🥤' }
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [customizationModal, setCustomizationModal] = useState<{
    isOpen: boolean;
    item: MenuItem | null;
  }>({ isOpen: false, item: null });

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVegFilter = vegFilter === 'all' || 
                            (vegFilter === 'veg' && item.isVeg) ||
                            (vegFilter === 'non-veg' && !item.isVeg);
    
    return matchesCategory && matchesSearch && matchesVegFilter;
  });

  const handleCustomize = (item: MenuItem) => {
    setCustomizationModal({ isOpen: true, item });
  };

  const closeCustomizationModal = () => {
    setCustomizationModal({ isOpen: false, item: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Delicious Campus Food 🍕
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fresh, tasty, and affordable meals made just for students. 
            Order now and satisfy your cravings!
          </p>
        </motion.div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <div className="flex gap-2">
            {(['all', 'veg', 'non-veg'] as const).map((filter) => (
              <motion.button
                key={filter}
                onClick={() => setVegFilter(filter)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  vegFilter === filter
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {filter === 'all' ? '🌟 All' : filter === 'veg' ? '🌱 Veg' : '🍖 Non-Veg'}
              </motion.button>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <MenuCard item={item} onCustomize={handleCustomize} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <CartIcon onClick={() => setIsCartOpen(true)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CustomizationModal
        item={customizationModal.item}
        isOpen={customizationModal.isOpen}
        onClose={closeCustomizationModal}
      />
    </div>
  );
};

export default Menu;
