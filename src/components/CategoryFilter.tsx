
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: { key: string; label: string; icon: string }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {categories.map((category) => (
        <motion.button
          key={category.key}
          onClick={() => onCategoryChange(category.key)}
          className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
            activeCategory === category.key
              ? 'bg-orange-500 dark:bg-orange-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-gray-200 dark:border-gray-700'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">{category.icon}</span>
          {category.label}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryFilter;
