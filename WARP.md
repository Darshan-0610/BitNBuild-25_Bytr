# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development
```bash
# Install dependencies
npm install

# Start development server
npm start
# Opens at http://localhost:3000

# Build for production
npm run build

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Firebase Commands
```bash
# Deploy entire project to Firebase
npm run firebase:deploy

# Serve locally using Firebase hosting
npm run firebase:serve

# Deploy only Firebase Functions
npm run functions:deploy

# Serve Firebase Functions locally  
npm run functions:serve

# Start Firebase emulators for local development
firebase emulators:start

# Login to Firebase CLI
firebase login
```

### Testing Individual Components
```bash
# Run specific test file
npm test -- --testPathPattern=ComponentName

# Run tests in watch mode
npm test -- --watch

# Run tests for specific directory
npm test -- --testPathPattern=pages/customer
```

## Architecture Overview

### Application Structure
This is a **dual-interface React application** for tiffin delivery logistics with role-based routing:

- **Customer Interface**: Meal ordering, daily confirmations, delivery tracking, festive specials
- **Vendor Interface**: Customer management, route optimization, analytics dashboard, QR scanning, reports

### Tech Stack Foundation
- **Frontend**: React 18 with React Router DOM for SPA navigation
- **Styling**: Tailwind CSS with custom color schemes (`tiffin` and `waste` palettes)
- **Backend**: Firebase ecosystem (Auth, Firestore, Functions, Hosting, Storage)
- **Maps**: Google Maps integration for route optimization
- **State**: React Context API + custom hooks (no external state management)

### Key Architectural Patterns

#### Authentication & Role-Based Access
- **useAuth hook** (`src/hooks/useAuth.js`) manages Firebase auth state and user roles
- **Role-based routing** in `App.js` protects routes by user type
- **Firestore security rules** enforce data access controls per user role
- User roles stored in Firestore `users` collection, fetched on auth state change

#### Component Organization
```
src/
├── components/          # Shared UI components (Navigation, LoadingSpinner)
├── pages/              # Route-specific page components
│   ├── customer/       # Customer-only pages (MealOrdering, DeliveryTracking)
│   ├── vendor/         # Vendor-only pages (AIAnalytics, CustomerManagement)
│   ├── CustomerDashboard.js
│   ├── VendorDashboard.js
│   └── Login.js
├── hooks/              # Custom React hooks (useAuth)
├── services/           # External service integrations (firebase.js)
└── App.js             # Main routing and auth logic
```

#### Firebase Data Architecture
**Critical Collections:**
- `users/{userId}` - User profiles with role assignment
- `orders/{orderId}` - Order tracking with customer/vendor relationships
- `vendors/{vendorId}` - Vendor business profiles and settings
- `customers/{customerId}` - Customer profiles and preferences
- `meals/{mealId}` - Available meals linked to vendors
- `deliveryRoutes/{routeId}` - Optimized delivery routes per vendor
- `analytics/{analyticsId}` - Waste tracking and demand prediction data

#### Security Model
- **Firestore Rules**: Users can only access their own data and related records
- **Firebase Auth**: Email/password with planned multi-provider support
- **Role Enforcement**: Server-side rules prevent cross-role data access
- **Environment Variables**: Firebase config externalized for security

## Firebase Setup Requirements

### Initial Configuration
1. **Firebase Project**: Create project named "tiffin-logistics-mvp" in Firebase Console
2. **Enable Services**: Authentication (Email/Password), Firestore, Storage, Hosting
3. **Replace Config**: Update `src/services/firebase.js` with your project's config
4. **Environment Variables**: Create `.env` file with all Firebase keys and Google Maps API key

### Google Maps Integration
- **APIs Required**: Maps JavaScript API, Places API, Directions API
- **Usage**: Route optimization in vendor dashboard, delivery tracking
- **Configuration**: API key goes in `public/index.html` and environment variables

### Demo Accounts
- Customer: `customer@demo.com` / `demo123`
- Vendor: `vendor@demo.com` / `demo123`

## Custom Development Patterns

### Tailwind Configuration
- **Custom Colors**: `tiffin` (orange shades) and `waste` (green shades) palettes
- **Animations**: Custom `fade-in` and `slide-up` keyframes
- **Plugins**: Forms and Typography plugins enabled
- **Font**: Inter as primary sans-serif font

### Firebase Emulators
- **Local Development**: Emulator ports configured in `firebase.json`
- **Services**: Auth (9099), Firestore (8080), Functions (5001), Hosting (5000)
- **Toggle**: Set `useEmulators = true` in `firebase.js` for local development

### Toast Notifications
- **Library**: react-hot-toast with custom styling
- **Configuration**: Dark theme with custom success/error colors
- **Usage**: Consistent user feedback across all operations

## Key Business Logic

### Route Optimization
- Vendor interface includes delivery route planning
- Google Maps integration for distance/time calculations
- Clustering nearby customers into "micro-delivery groups"

### Waste Reduction Features
- AI Analytics dashboard tracks demand patterns
- Daily confirmation system reduces over-preparation
- QR code system for container return tracking

### Order Flow
1. **Customer**: Browse meals → Place order → Daily confirmation → Track delivery
2. **Vendor**: View orders → Optimize routes → Prepare meals → Scan returns → Generate reports

## Development Notes

### State Management Strategy
- **Global State**: Authentication via useAuth hook
- **Local State**: Component-specific useState/useEffect
- **Server State**: Direct Firebase queries (no caching layer)
- **No Redux/Zustand**: Intentionally simple for hackathon MVP scope

### Testing Approach
- **Framework**: React Testing Library with Jest
- **Coverage**: Run `npm test -- --coverage` for reports
- **Strategy**: Focus on critical user flows and Firebase integration

### Performance Optimizations
- **Code Splitting**: React.lazy() for route-level splitting
- **Caching**: Firebase hosting headers for static assets
- **Bundle Size**: Minimal dependencies for fast loading

### Deployment Pipeline
1. `npm run build` - Creates optimized production bundle
2. `firebase deploy` - Deploys to Firebase Hosting
3. Functions deploy separately if backend logic added

## Environment Variables Required
```env
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_GOOGLE_MAPS_API_KEY=
```