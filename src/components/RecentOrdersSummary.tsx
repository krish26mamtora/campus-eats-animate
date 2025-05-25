
import { motion } from 'framer-motion';
import { Order } from '../store/useCartStore';
import { Clock, MapPin, Star } from 'lucide-react';

interface RecentOrdersSummaryProps {
  orders: Order[];
}

const RecentOrdersSummary = ({ orders }: RecentOrdersSummaryProps) => {
  if (orders.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 mb-8 text-white"
    >
      <h2 className="text-xl font-bold mb-4">Recent Orders Summary 📊</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">#{order.orderId.slice(-4)}</span>
              <span className="text-sm opacity-80">
                {new Date(order.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            <div className="text-sm opacity-90 mb-3">
              {order.items.length} item{order.items.length > 1 ? 's' : ''} • ₹{order.total}
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate max-w-20">{order.deliveryAddress}</span>
              </div>
              
              {order.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                  <span>{order.rating}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentOrdersSummary;
