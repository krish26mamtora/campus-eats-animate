
import { motion } from 'framer-motion';
import { useCartStore, Order } from '../store/useCartStore';
import { Clock, CheckCircle, Package, Truck, Star, RotateCcw, X, Filter, MapPin, CreditCard, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import OrderStatusUpdateModal from '../components/OrderStatusUpdateModal';
import OrderFilters from '../components/OrderFilters';
import RecentOrdersSummary from '../components/RecentOrdersSummary';
import OrderAnalytics from '../components/OrderAnalytics';
import { useToast } from '@/hooks/use-toast';

interface FilterState {
  status: string;
  priceRange: [number, number];
  dateRange: string;
  paymentMethod: string;
}

const Orders = () => {
  const { orders, updateOrderStatus, cancelOrder, reorderItems, rateOrder, generateDummyOrders } = useCartStore();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    priceRange: [0, 1000],
    dateRange: 'all',
    paymentMethod: 'all'
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low'>('newest');
  const { toast } = useToast();

  useEffect(() => {
    if (orders.length === 0) {
      generateDummyOrders();
    }
  }, [orders.length, generateDummyOrders]);

  useEffect(() => {
    let filtered = [...orders];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Price range filter
    filtered = filtered.filter(order => 
      order.total >= filters.priceRange[0] && order.total <= filters.priceRange[1]
    );

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      let cutoff = 0;
      
      switch (filters.dateRange) {
        case 'today':
          cutoff = now - dayMs;
          break;
        case 'week':
          cutoff = now - (7 * dayMs);
          break;
        case 'month':
          cutoff = now - (30 * dayMs);
          break;
      }
      
      if (cutoff > 0) {
        filtered = filtered.filter(order => order.timestamp > cutoff);
      }
    }

    // Payment method filter
    if (filters.paymentMethod !== 'all') {
      filtered = filtered.filter(order => order.paymentMethod === filters.paymentMethod);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'price-high':
          return b.total - a.total;
        case 'price-low':
          return a.total - b.total;
        default:
          return b.timestamp - a.timestamp;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, filters, sortBy]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'preparing':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'ready':
        return <Package className="h-5 w-5 text-green-500" />;
      case 'out-for-delivery':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return 'Order Placed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready for Pickup';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'preparing':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'ready':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'out-for-delivery':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    setShowStatusModal(false);
    toast({
      title: "Status Updated",
      description: `Order status changed to ${getStatusText(newStatus)}`,
    });
  };

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId);
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled successfully",
      variant: "destructive"
    });
  };

  const handleReorder = (orderId: string) => {
    reorderItems(orderId);
    toast({
      title: "Items Added to Cart",
      description: "Previous order items have been added to your cart",
    });
  };

  const handleRating = (orderId: string, rating: number) => {
    rateOrder(orderId, rating);
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback!",
    });
  };

  const formatCustomizations = (customizations: any) => {
    if (!customizations) return '';
    
    const parts = [];
    if (customizations.spiceLevel) parts.push(`${customizations.spiceLevel} Spice`);
    if (customizations.addCheese) parts.push('Extra Cheese');
    if (customizations.portionSize) parts.push(`${customizations.portionSize} Portion`);
    if (customizations.addExtraGravy) parts.push('Extra Gravy');
    if (customizations.sugarLevel) parts.push(`${customizations.sugarLevel} Sugar`);
    if (customizations.iceLevel) parts.push(`${customizations.iceLevel}`);
    if (customizations.addLemon) parts.push('With Lemon');
    if (customizations.cupSize) parts.push(`${customizations.cupSize} Cup`);
    
    return parts.join(', ');
  };

  const getItemDisplayPrice = (item: any) => {
    const basePrice = item.price;
    const customizationPrice = item.customizationPrice || 0;
    return basePrice + customizationPrice;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">My Orders 📋</h1>
          <p className="text-xl text-gray-600">Track and manage your delicious meals</p>
        </motion.div>

        {/* Analytics Dashboard */}
        <OrderAnalytics orders={orders} />

        {/* Recent Orders Summary */}
        <RecentOrdersSummary orders={orders.slice(0, 3)} />

        {/* Filters and Sorting */}
        <OrderFilters 
          filters={filters}
          onFiltersChange={setFilters}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {filteredOrders.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-6">📱</div>
            <h3 className="text-2xl font-medium text-gray-600 mb-4">
              {orders.length === 0 ? "No orders yet!" : "No orders match your filters"}
            </h3>
            <p className="text-gray-500 mb-8">
              {orders.length === 0 
                ? "Order some delicious food from our menu to see your orders here."
                : "Try adjusting your filters to see more orders."
              }
            </p>
            <motion.a
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">🍽️</span>
              Browse Menu
            </motion.a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          Order #{order.orderId}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {new Date(order.timestamp).toLocaleString()}
                        </p>
                      </div>
                      
                      {order.estimatedTime && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="flex items-center space-x-1 text-orange-600">
                          <Timer className="h-4 w-4" />
                          <span className="text-sm font-medium">{order.estimatedTime} min</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="font-medium text-sm">{getStatusText(order.status)}</span>
                      </div>
                      
                      {(order.status === 'placed' || order.status === 'preparing') && (
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowStatusModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Update Status"
                        >
                          <Filter className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{order.deliveryAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span className="capitalize">{order.paymentMethod}</span>
                    </div>
                    {order.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{order.rating}/5</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={`${item.id}_${itemIndex}`} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          {item.customizations && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatCustomizations(item.customizations)}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            ₹{getItemDisplayPrice(item)} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-orange-600">
                          ₹{getItemDisplayPrice(item) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 flex justify-between items-center">
                    <div className="flex space-x-3">
                      {(order.status === 'placed' || order.status === 'preparing') && (
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          <span className="text-sm">Cancel</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleReorder(order.orderId)}
                        className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="text-sm">Reorder</span>
                      </button>

                      {order.status === 'delivered' && !order.rating && (
                        <div className="flex items-center space-x-1">
                          <span className="text-sm text-gray-600">Rate:</span>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRating(order.orderId, star)}
                              className="p-1 text-gray-300 hover:text-yellow-400 transition-colors"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <span className="text-2xl font-bold text-orange-600">₹{order.total}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusModal && selectedOrder && (
          <OrderStatusUpdateModal
            order={selectedOrder}
            onUpdateStatus={handleStatusUpdate}
            onClose={() => setShowStatusModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
