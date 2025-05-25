
import { motion } from 'framer-motion';
import { Order } from '../store/useCartStore';
import { TrendingUp, Clock, Star, ShoppingBag } from 'lucide-react';

interface OrderAnalyticsProps {
  orders: Order[];
}

const OrderAnalytics = ({ orders }: OrderAnalyticsProps) => {
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
  const averageRating = orders.filter(o => o.rating).reduce((sum, order, _, arr) => sum + (order.rating || 0) / arr.length, 0);

  const analytics = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingBag className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      prefix: ''
    },
    {
      title: 'Total Spent',
      value: totalSpent,
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      prefix: '₹'
    },
    {
      title: 'Avg Order Value',
      value: Math.round(averageOrderValue),
      icon: <Clock className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600',
      prefix: '₹'
    },
    {
      title: 'Avg Rating',
      value: averageRating.toFixed(1),
      icon: <Star className="h-6 w-6" />,
      color: 'from-yellow-500 to-yellow-600',
      prefix: ''
    }
  ];

  if (totalOrders === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {analytics.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-gradient-to-r ${stat.color} rounded-xl p-4 text-white`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">{stat.title}</p>
              <p className="text-2xl font-bold">
                {stat.prefix}{stat.value}
              </p>
            </div>
            <div className="opacity-80">
              {stat.icon}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default OrderAnalytics;
