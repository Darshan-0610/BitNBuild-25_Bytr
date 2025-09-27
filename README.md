# 🍱 Tiffin Logistics MVP - BitNBuild'25

A modern web application for tiffin delivery services with **logistics optimization** and **food waste reduction**. Built with React, Firebase, and Tailwind CSS.

**Team Members:**
1. Darshan
2. Satyam Kantode  
3. Sukhdeep Deshmukh
4. Rudra Sane

![Tiffin Logistics](https://img.shields.io/badge/React-18.2.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-9.17.1-orange)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.2.4-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### Customer App (Web/Mobile)
- **Meal Ordering**: Browse and order from available tiffin options
- **Daily Confirmation**: Skip/Confirm daily meals with custom delivery times
- **Festive Specials**: Limited edition meals for special occasions
- **Delivery Tracking**: Real-time order status and location tracking
- **User Authentication**: Secure login/signup system

### Vendor Dashboard (Web)
- **Customer Management**: Add and manage customer profiles
- **Route Optimization**: View optimized delivery routes
- **AI Sales & Waste Dashboard**: Basic demand prediction and waste tracking
- **Daily Reports**: Auto-generated sales, waste, and skip reports
- **QR Code System**: Container tracking for tiffin returns
- **Micro-Delivery Groups**: Efficient clustering of nearby deliveries

## 🛠️ Tech Stack

- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Hosting, Functions)
- **Maps**: Google Maps Directions API
- **UI Icons**: Lucide React
- **Notifications**: Firebase Cloud Messaging
- **Charts**: Chart.js + React Chart.js 2
- **QR Codes**: React QR Scanner + QRCode libraries

## 📁 Project Structure

```
tiffin-logistics-mvp/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable React components
│   ├── pages/            # Application pages
│   │   ├── customer/     # Customer-specific pages
│   │   └── vendor/       # Vendor-specific pages
│   ├── hooks/            # Custom React hooks
│   ├── services/         # Firebase and external services
│   └── utils/            # Utility functions
├── firebase/             # Firebase configuration
├── functions/            # Firebase Cloud Functions
└── ...configuration files
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase CLI
- Google Maps API Key

### 1. Clone and Install

```bash
git clone <repository-url>
cd tiffin-logistics-mvp
npm install
```

### 2. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project named "tiffin-logistics-mvp"
   - Enable Authentication, Firestore, Storage, and Hosting

2. **Configure Firebase**:
   - Copy your Firebase config from Project Settings
   - Replace the config in `src/services/firebase.js`

3. **Install Firebase CLI**:
```bash
npm install -g firebase-tools
firebase login
firebase init
```

4. **Configure Authentication**:
   - Enable Email/Password authentication in Firebase Console
   - (Optional) Add other providers like Google, Facebook

### 3. Google Maps Setup

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Places API
3. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `public/index.html`

### 4. Environment Variables

Create `.env` file in root directory:
```env
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-key
```

### 5. Run Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 🔐 Demo Credentials

For quick testing, use these demo accounts:

**Customer Account:**
- Email: `customer@demo.com`
- Password: `demo123`

**Vendor Account:**
- Email: `vendor@demo.com`
- Password: `vendor456`

## 📱 Key Features Walkthrough

### Customer Journey
1. **Login/Signup**: Secure authentication with role selection
2. **Dashboard**: Overview of today's orders and quick actions
3. **Order Meals**: Browse available tiffins with ratings and prices
4. **Daily Confirmations**: Manage upcoming meal deliveries
5. **Track Delivery**: Real-time order status updates
6. **Festive Specials**: Limited-time meal offerings

### Vendor Journey
1. **Dashboard**: Business metrics and recent orders overview
2. **Customer Management**: Add/edit customer profiles
3. **Route Optimization**: Efficient delivery route planning
4. **Analytics**: AI-powered demand prediction and waste tracking
5. **QR Scanner**: Container return management
6. **Reports**: Daily business performance reports

## 🏗️ Database Schema (Firestore)

### Collections Structure

```javascript
// Users Collection
users: {
  [userId]: {
    email: string,
    role: 'customer' | 'vendor',
    createdAt: timestamp,
    updatedAt: timestamp
  }
}

// Customers Collection  
customers: {
  [customerId]: {
    email: string,
    name: string,
    phone: string,
    address: string,
    preferences: object,
    createdAt: timestamp
  }
}

// Vendors Collection
vendors: {
  [vendorId]: {
    email: string,
    businessName: string,
    phone: string,
    address: string,
    serviceAreas: array,
    createdAt: timestamp
  }
}

// Orders Collection
orders: {
  [orderId]: {
    customerId: string,
    vendorId: string,
    items: array,
    totalAmount: number,
    status: string,
    deliveryAddress: string,
    deliveryTime: timestamp,
    createdAt: timestamp
  }
}

// Meals Collection
meals: {
  [mealId]: {
    vendorId: string,
    name: string,
    description: string,
    price: number,
    category: string,
    available: boolean,
    preparationTime: number
  }
}
```

## 🚀 Deployment

### Firebase Hosting Deployment

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Firebase**:
```bash
firebase deploy
```

3. **Deploy functions** (if needed):
```bash
firebase deploy --only functions
```

### Custom Domain (Optional)

1. Add custom domain in Firebase Console
2. Configure DNS settings
3. Enable SSL certificate

## 📊 Analytics & Monitoring

### Built-in Analytics Features
- **Demand Prediction**: Rule-based forecasting for meal preparation
- **Waste Tracking**: Monitor food waste patterns
- **Route Efficiency**: Delivery route optimization metrics
- **Customer Behavior**: Order patterns and preferences

### Performance Monitoring
- Firebase Performance Monitoring
- Error tracking with Firebase Crashlytics
- User engagement analytics

## 🔧 Development Guidelines

### Code Structure
- **Components**: Reusable UI components with consistent styling
- **Pages**: Route-specific components
- **Hooks**: Custom React hooks for state management
- **Services**: External API integrations
- **Utils**: Helper functions and utilities

### Styling Guidelines
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Pre-defined button and card styles
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Custom tiffin and waste color palettes

### State Management
- **React Hooks**: useState, useEffect for local state
- **Context API**: For global state (authentication)
- **Custom Hooks**: Reusable stateful logic

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Production Optimizations

### Performance
- **Code Splitting**: Implemented with React.lazy()
- **Image Optimization**: Compressed images and lazy loading
- **Caching**: Service worker for offline functionality
- **Bundle Analysis**: Webpack Bundle Analyzer

### Security
- **Firebase Security Rules**: Proper access control
- **Input Validation**: Client and server-side validation
- **HTTPS**: Enforced secure connections
- **API Key Protection**: Environment variable configuration

## 📝 TODO & Future Enhancements

### Immediate Next Steps
- [ ] Integrate real Google Maps for route optimization
- [ ] Implement advanced AI/ML for demand prediction  
- [ ] Add payment gateway integration
- [ ] Set up push notifications
- [ ] Add advanced reporting dashboard

### Advanced Features
- [ ] Mobile app development (React Native)
- [ ] Multi-vendor marketplace
- [ ] Subscription management
- [ ] Inventory management system
- [ ] Customer loyalty program
- [ ] Advanced analytics dashboard

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Authentication Error**:
   - Verify Firebase config in `src/services/firebase.js`
   - Check if Authentication is enabled in Firebase Console

2. **Google Maps Not Loading**:
   - Verify API key in `public/index.html`
   - Ensure Maps JavaScript API is enabled

3. **Build Failures**:
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check for environment variables

4. **Firestore Permission Denied**:
   - Review Firestore security rules in `firestore.rules`
   - Ensure user authentication is working

### Support

For issues and support:
- Create GitHub issue
- Check Firebase documentation
- Review React documentation

---

## 🎯 Hackathon Demo Script

### 2-Minute Demo Flow
1. **Problem Statement** (15 seconds)
2. **Customer Flow** (45 seconds): Login → Order → Confirm → Track
3. **Vendor Flow** (45 seconds): Dashboard → Routes → Analytics → Reports
4. **Key Features** (15 seconds): Waste reduction, Route optimization

### Key Demo Points
- ✅ Working authentication system
- ✅ Responsive design (mobile & desktop)
- ✅ Real-time order tracking
- ✅ Route optimization dashboard
- ✅ Waste reduction analytics
- ✅ Professional UI/UX

---

**Built for Hackathon Success! 🏆**

*Ready to deploy, demo, and win!*
