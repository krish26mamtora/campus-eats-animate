
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../store/useCartStore';
import { Clock, Package, Truck, CheckCircle, X } from 'lucide-react';

interface OrderStatusUpdateModalProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  onClose: () => void;
}

const OrderStatusUpdateModal = ({ order, onUpdateStatus, onClose }: OrderStatusUpdateModalProps) => {
  const statusOptions: { status: Order['status']; label: string; icon: React.ReactNode; color: string }[] = [
    { status: 'placed', label: 'Order Placed', icon: <Clock className="h-5 w-5" />, color: 'bg-blue-500' },
    { status: 'preparing', label: 'Preparing', icon: <Clock className="h-5 w-5" />, color: 'bg-orange-500' },
    { status: 'ready', label: 'Ready for Pickup', icon: <Package className="h-5 w-5" />, color: 'bg-green-500' },
    { status: 'out-for-delivery', label: 'Out for Delivery', icon: <Truck className="h-5 w-5" />, color: 'bg-purple-500' },
    { status: 'delivered', label: 'Delivered', icon: <CheckCircle className="h-5 w-5" />, color: 'bg-green-600' }
  ];

  return (
    <AnimatePresence>
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
          className="bg-white rounded-xl shadow-xl max-w-md w-full"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Update Order Status</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">Order #{order.orderId}</p>
              <p className="text-lg font-semibold text-gray-800">{order.items.length} items • ₹{order.total}</p>
            </div>

            <div className="space-y-3">
              {statusOptions.map((option) => (
                <motion.button
                  key={option.status}
                  onClick={() => onUpdateStatus(order.orderId, option.status)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                    order.status === option.status 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`p-2 rounded-full text-white ${option.color}`}>
                    {option.icon}
                  </div>
                  <span className="font-medium text-gray-800">{option.label}</span>
                  {order.status === option.status && (
                    <span className="ml-auto text-orange-500 text-sm">Current</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderStatusUpdateModal;
