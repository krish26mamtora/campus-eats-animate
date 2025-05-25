
import { motion } from 'framer-motion';
import { useCartStore, MenuItem } from '../store/useCartStore';
import { toast } from 'sonner';
import { Settings, Star, Clock, Flame, Leaf } from 'lucide-react';

interface MenuCardProps {
  item: MenuItem;
  onCustomize: (item: MenuItem) => void;
  onViewDetails: (item: MenuItem) => void;
}

const MenuCard = ({ item, onCustomize, onViewDetails }: MenuCardProps) => {
  const addItem = useCartStore(state => state.addItem);

  // Generate dummy ratings and cooking time
  const rating = (4.0 + Math.random() * 1).toFixed(1);
  const cookingTime = Math.floor(Math.random() * 20) + 10; // 10-30 minutes
  const totalReviews = Math.floor(Math.random() * 200) + 50;

  const handleAddToCart = () => {
    addItem(item);
    toast.success(`${item.name} added to cart!`);
  };

  const handleCustomize = () => {
    onCustomize(item);
  };

  const getDifficultyColor = (time: number) => {
    if (time < 15) return 'text-green-600 dark:text-green-400';
    if (time < 25) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSpiceIndicator = () => {
    const spiceLevel = Math.floor(Math.random() * 4); // 0-3
    return Array.from({ length: 4 }, (_, i) => (
      <Flame
        key={i}
        className={`h-3 w-3 ${
          i < spiceLevel
            ? 'text-red-500 fill-red-500'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onViewDetails(item)}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={item.image}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlays */}
        <div className="absolute top-3 left-3">
          <motion.span
            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${
              item.isVeg 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {item.isVeg ? (
              <>
                <Leaf className="h-3 w-3" />
                <span>Veg</span>
              </>
            ) : (
              <>
                <span>🍖</span>
                <span>Non-Veg</span>
              </>
            )}
          </motion.span>
        </div>

        {/* Quick Stats */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-60 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center space-x-1 text-white text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Cooking Time Badge */}
        <div className="absolute bottom-3 left-3">
          <motion.div
            className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Clock className={`h-3 w-3 ${getDifficultyColor(cookingTime)}`} />
            <span className={`text-xs font-medium ${getDifficultyColor(cookingTime)}`}>
              {cookingTime}m
            </span>
          </motion.div>
        </div>

        {/* Spice Level */}
        {!item.isVeg && item.category !== 'beverages' && (
          <div className="absolute bottom-3 right-3">
            <motion.div
              className="bg-white dark:bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {getSpiceIndicator()}
            </motion.div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {item.name}
          </h3>
          <motion.div
            className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400"
            whileHover={{ scale: 1.1 }}
          >
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{rating}</span>
            <span className="text-xs">({totalReviews})</span>
          </motion.div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Additional Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{cookingTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>👥</span>
              <span>{totalReviews} reviews</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <motion.span 
            className="text-2xl font-bold text-orange-600 dark:text-orange-400"
            whileHover={{ scale: 1.1 }}
          >
            ₹{item.price}
          </motion.span>
          
          {/* Popularity Badge */}
          {parseFloat(rating) > 4.5 && (
            <motion.span
              className="px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-medium"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              ⭐ Popular
            </motion.span>
          )}
        </div>

        <div className="flex space-x-2">
          <motion.button
            onClick={handleCustomize}
            className="flex-1 bg-white dark:bg-gray-700 border border-orange-500 dark:border-orange-400 text-orange-600 dark:text-orange-400 px-3 py-2 rounded-lg font-medium hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 flex items-center justify-center space-x-1"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="h-4 w-4" />
            <span>Customize</span>
          </motion.button>
          
          <motion.button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
