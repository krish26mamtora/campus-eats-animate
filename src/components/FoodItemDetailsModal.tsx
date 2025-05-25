import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Clock, Flame, Leaf, Users, ThumbsUp, MessageCircle, Award } from 'lucide-react';
import { MenuItem } from '../store/useCartStore';

interface FoodItemDetailsModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCustomize: (item: MenuItem) => void;
}

// Mock data for ingredients and reviews
const mockIngredients: Record<string, string[]> = {
  'Veg Burger': ['Potato patty', 'Lettuce', 'Tomato', 'Onion', 'Cheese', 'Mayo', 'Burger bun'],
  'Chicken Burger': ['Chicken patty', 'Lettuce', 'Tomato', 'Onion', 'Cheese', 'Mayo', 'Burger bun'],
  'French Fries': ['Potatoes', 'Salt', 'Vegetable oil', 'Herbs'],
  'Pizza': ['Wheat flour', 'Tomato sauce', 'Cheese', 'Bell peppers', 'Onions', 'Olives', 'Herbs'],
  'Pasta': ['Durum wheat pasta', 'Tomato sauce', 'Olive oil', 'Garlic', 'Herbs', 'Parmesan cheese'],
  'Noodles': ['Wheat noodles', 'Vegetables', 'Soy sauce', 'Garlic', 'Ginger', 'Chili'],
  'Fried Rice': ['Rice', 'Vegetables', 'Soy sauce', 'Garlic', 'Ginger', 'Eggs'],
  'Sandwich': ['Bread', 'Lettuce', 'Tomato', 'Cucumber', 'Cheese', 'Mayo', 'Sauce'],
  'Samosa': ['Potato', 'Peas', 'Spices', 'Flour dough'],
  'Dosa': ['Rice batter', 'Lentil batter', 'Potato filling', 'Spices'],
  'Idli': ['Rice batter', 'Lentil batter', 'Steamed'],
  'Vada': ['Lentil batter', 'Spices', 'Deep fried'],
  'Tea': ['Tea leaves', 'Milk', 'Sugar', 'Water'],
  'Coffee': ['Coffee beans', 'Milk', 'Sugar', 'Water'],
  'Lemonade': ['Lemon juice', 'Sugar', 'Water', 'Mint leaves'],
  'Milkshake': ['Milk', 'Ice cream', 'Flavor syrup', 'Whipped cream'],
};

interface MockReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

const generateMockReviews = (itemName: string): MockReview[] => {
  // Generate 3 mock reviews based on the item name
  return [
    {
      id: 1,
      name: 'Rahul S.',
      rating: 4.5,
      comment: `The ${itemName} was delicious! Perfectly prepared and served hot. Would definitely order again.`,
      date: '2 days ago',
      likes: 12
    },
    {
      id: 2,
      name: 'Priya M.',
      rating: 5,
      comment: `Best ${itemName} on campus! I order this at least once a week. Never disappoints.`,
      date: '1 week ago',
      likes: 24
    },
    {
      id: 3,
      name: 'Arjun K.',
      rating: 4,
      comment: `Good ${itemName}, but could use a bit more flavor. Still, it's a great value for the price.`,
      date: '2 weeks ago',
      likes: 8
    }
  ];
};

// Nutritional info mock data
const generateNutritionalInfo = (itemName: string) => {
  // Generate random but realistic nutritional values based on food category
  const isVeg = !itemName.toLowerCase().includes('chicken') && 
                !itemName.toLowerCase().includes('egg') && 
                !itemName.toLowerCase().includes('fish');
  
  const isSnack = itemName.includes('Fries') || 
                 itemName.includes('Samosa') || 
                 itemName.includes('Vada');
  
  const isBeverage = itemName.includes('Tea') || 
                    itemName.includes('Coffee') || 
                    itemName.includes('Lemonade') || 
                    itemName.includes('Milkshake');
  
  let calories, protein, carbs, fat;
  
  if (isBeverage) {
    calories = Math.floor(Math.random() * 100) + 50;
    protein = Math.floor(Math.random() * 3);
    carbs = Math.floor(Math.random() * 15) + 5;
    fat = Math.floor(Math.random() * 5);
  } else if (isSnack) {
    calories = Math.floor(Math.random() * 200) + 150;
    protein = Math.floor(Math.random() * 5) + 2;
    carbs = Math.floor(Math.random() * 20) + 15;
    fat = Math.floor(Math.random() * 10) + 5;
  } else {
    calories = Math.floor(Math.random() * 300) + 200;
    protein = isVeg ? (Math.floor(Math.random() * 10) + 5) : (Math.floor(Math.random() * 15) + 10);
    carbs = Math.floor(Math.random() * 30) + 20;
    fat = Math.floor(Math.random() * 15) + 5;
  }
  
  return {
    calories,
    protein,
    carbs,
    fat
  };
};

const FoodItemDetailsModal = ({ item, isOpen, onClose, onCustomize }: FoodItemDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'nutrition'>('overview');
  
  if (!item) return null;
  
  const ingredients = mockIngredients[item.name] || ['Ingredients not available'];
  const reviews = generateMockReviews(item.name);
  const nutritionalInfo = generateNutritionalInfo(item.name);
  
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Generate random preparation time between 10-30 minutes
  const prepTime = Math.floor(Math.random() * 20) + 10;
  
  // Generate random popularity percentage between 70-95%
  const popularity = Math.floor(Math.random() * 25) + 70;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto transition-colors duration-300"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with image */}
              <div className="relative h-64 overflow-hidden rounded-t-xl">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{item.name}</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-medium">{averageRating.toFixed(1)}</span>
                      <span className="text-sm text-gray-300 ml-1">({reviews.length} reviews)</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-300 mr-1" />
                      <span>{prepTime} min</span>
                    </div>
                    
                    <div className="flex items-center">
                      {item.isVeg ? (
                        <Leaf className="h-5 w-5 text-green-400 mr-1" />
                      ) : (
                        <Flame className="h-5 w-5 text-red-400 mr-1" />
                      )}
                      <span>{item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                  <button
                    className={`px-6 py-3 font-medium text-sm transition-colors ${
                      activeTab === 'overview' 
                        ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-sm transition-colors ${
                      activeTab === 'reviews' 
                        ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reviews
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-sm transition-colors ${
                      activeTab === 'nutrition' 
                        ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    onClick={() => setActiveTab('nutrition')}
                  >
                    Nutrition
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ingredients</h3>
                      <ul className="grid grid-cols-2 gap-2">
                        {ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                            <span className="mr-2">•</span>
                            {ingredient}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 flex items-center">
                        <Users className="h-8 w-8 text-orange-500 dark:text-orange-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Popularity</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{popularity}%</div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 flex items-center">
                        <Clock className="h-8 w-8 text-green-500 dark:text-green-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Prep Time</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{prepTime} minutes</div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center">
                        <Award className="h-8 w-8 text-blue-500 dark:text-blue-400 mr-3" />
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">Rating</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}/5</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Reviews</h3>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                        <span className="font-medium text-gray-900 dark:text-white">{averageRating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">({reviews.length} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">{review.name}</div>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${
                                      i < Math.floor(review.rating) 
                                        ? 'text-yellow-400 fill-yellow-400' 
                                        : i < review.rating 
                                          ? 'text-yellow-400 fill-yellow-400 opacity-50' 
                                          : 'text-gray-300 dark:text-gray-600'
                                    }`} 
                                  />
                                ))}
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{review.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{review.likes}</span>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-600 dark:text-gray-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'nutrition' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Nutritional Information</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Calories</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{nutritionalInfo.calories}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">kcal</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Protein</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{nutritionalInfo.protein}g</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Carbs</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{nutritionalInfo.carbs}g</div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Fat</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{nutritionalInfo.fat}g</div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Dietary Information</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.isVeg 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                        </span>
                        
                        {item.isVeg && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            Egg Free
                          </span>
                        )}
                        
                        {Math.random() > 0.5 && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                            Gluten Free
                          </span>
                        )}
                        
                        {Math.random() > 0.7 && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                            Dairy Free
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                      * Nutritional information is approximate and may vary based on preparation method and serving size.
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer with buttons */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                    ₹{item.price}
                  </div>
                  <div className="flex-1"></div>
                  <button
                    onClick={() => {
                      onClose(); // Close the details modal first
                      setTimeout(() => onCustomize(item), 100); // Open customization modal with a slight delay
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-colors"
                  >
                    Customize & Order
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FoodItemDetailsModal;
