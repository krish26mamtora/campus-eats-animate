# 🏫 Campus Canteen

![Campus Canteen](https://i.imgur.com/XYZ123.png)

A modern, animated food ordering system designed specifically for campus environments. Built with React, TypeScript, and Framer Motion for smooth animations and transitions.

## ✨ Features

### 🍽️ Interactive Food Menu
- **Animated Food Cards**: Smooth hover and tap animations for an engaging user experience
- **Detailed Food Information**: View ingredients, nutritional info, and customer reviews
- **Category Filtering**: Easily filter food items by category (Snacks, Main Course, Beverages)
- **Search Functionality**: Search for specific food items across all categories
- **Dietary Preferences**: Filter by vegetarian and non-vegetarian options

### 🛒 Smart Cart System
- **Animated Cart Drawer**: Slide-in cart with smooth transitions
- **Item Customization**: Customize food items with various options based on food type
- **Quantity Management**: Easily increase or decrease item quantities
- **Price Calculation**: Real-time price updates based on customizations and quantities

### 📋 Order Management
- **Order Tracking**: Track the status of your orders in real-time
- **Order History**: View past orders and their details
- **Order Filtering**: Filter orders by status, date, price range, and payment method
- **Reordering**: Quickly reorder favorite items from past orders
- **Order Rating**: Rate and review your delivered orders

### 🌓 Theme Support
- **Light/Dark Mode**: Toggle between light and dark themes
- **System Preference Detection**: Automatically matches your system's theme preference
- **Persistent Theme**: Remembers your theme preference across sessions
- **Smooth Transitions**: Elegant transitions between theme changes

### 🎨 UI/UX Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Micro-interactions**: Small, delightful animations throughout the interface
- **Accessibility**: Designed with accessibility in mind
- **Intuitive Navigation**: Easy-to-use interface with clear visual hierarchy

## 🛠️ Technologies Used

- **React**: Frontend library for building the user interface
- **TypeScript**: Type-safe JavaScript for better development experience
- **Framer Motion**: Animation library for creating fluid motion
- **TailwindCSS**: Utility-first CSS framework for styling
- **React Router**: For navigation between different pages
- **Zustand**: State management for the application
- **Lucide Icons**: Beautiful, consistent icons

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/campus-canteen.git
cd campus-canteen
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Application Structure

```
campus-canteen/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (theme, etc.)
│   ├── data/            # Mock data for the application
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── store/           # State management
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
└── package.json         # Project dependencies and scripts
```

## 🧩 Key Components

- **MenuCard**: Displays food items with animations and details
- **CategoryFilter**: Allows filtering food items by category
- **SearchBar**: Enables searching across all food items
- **CartDrawer**: Slide-in cart interface for managing orders
- **CustomizationModal**: Modal for customizing food items
- **FoodItemDetailsModal**: Detailed view of food items with tabs for different information
- **OrderFilters**: Comprehensive filtering for orders
- **ThemeProvider**: Manages theme state and preferences

## 🎯 Future Enhancements

- **User Authentication**: Login and registration functionality
- **Payment Integration**: Real payment processing
- **Push Notifications**: Order status updates
- **Favorites System**: Save favorite food items
- **Social Sharing**: Share food items with friends
- **Loyalty Program**: Rewards for frequent customers
- **Multilingual Support**: Support for multiple languages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- [Your Name](https://github.com/yourusername)

## 🙏 Acknowledgements

- [Framer Motion](https://www.framer.com/motion/) for the amazing animation library
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) for the beautiful icons
- [React](https://reactjs.org/) for the frontend library
