export type Role = 'FARMER' | 'CONSUMER' | 'BULK_BUYER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
  location: string;
  createdAt: string;
  farmerProfile?: {
    id: string;
    farmName: string;
    farmLocation: string;
    organicCertified: boolean;
    farmingType: string;
    bio?: string;
    rating: number;
    totalSales: number;
  };
  consumerProfile?: {
    id: string;
    preferredCategory?: string;
    addressLine?: string;
  };
  buyerProfile?: {
    id: string;
    organizationName: string;
    businessType: string;
    requiredProducts?: string;
    expectedQuantity?: string;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface Product {
  id: string;
  farmerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  unit: string;
  location: string;
  harvestDate: string;
  organic: boolean;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  image: string;
  rating: number;
  salesCount: number;
  createdAt: string;
  category?: Category;
  farmer?: {
    id: string;
    name: string;
    location: string;
    farmerProfile?: any;
  };
  reviews?: Review[];
}

export interface PriceComparison {
  productId: string;
  productName: string;
  unit: string;
  farmConnectPrice: number;
  localMarketPrice: number;
  retailPrice: number;
  savingsVsLocalAmount: number;
  savingsVsLocalPercent: number;
  savingsVsRetailAmount: number;
  savingsVsRetailPercent: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  unit: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  farmerId: string;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY_FOR_PICKUP' | 'PICKED_UP' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  shippingAddress: string;
  deliveryType: string;
  createdAt: string;
  buyer?: User;
  farmer?: User;
  items: OrderItem[];
  payment?: {
    id: string;
    transactionId: string;
    status: string;
    amount: number;
    method: string;
    paidAt: string;
  };
  delivery?: Delivery;
  reviews?: Review[];
}

export interface Delivery {
  id: string;
  orderId: string;
  farmerId: string;
  consumerId: string;
  pickupLocation: string;
  deliveryLocation: string;
  status: string;
  distanceKm: number;
  estimatedMins: number;
  routeDetails?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  orderId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    location?: string;
  };
}

export interface DemandForecast {
  productId: string;
  productName: string;
  currentDemand: number;
  predictedDemand7Days: number;
  predictedDemand30Days: number;
  percentageChange: number;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  recommendedStock: number;
  confidenceScore: number;
  dailyForecast: Array<{ date: string; historical: number | null; predicted: number }>;
}

export interface RouteOptimization {
  pickupLocation: string;
  originalRoute: string[];
  optimizedRoute: string[];
  originalDistanceKm: number;
  optimizedDistanceKm: number;
  distanceSavedKm: number;
  timeSavedMins: number;
  efficiencyGainPercent: number;
}

export interface BulkRequest {
  id: string;
  buyerId: string;
  buyer?: User;
  productName: string;
  quantity: number;
  unit: string;
  requiredDate: string;
  targetPrice: number;
  location: string;
  status: string;
  createdAt: string;
  offers?: FarmerOffer[];
}

export interface FarmerOffer {
  id: string;
  bulkRequestId: string;
  farmerId: string;
  farmer?: User;
  offeredQuantity: number;
  pricePerUnit: number;
  deliveryDate: string;
  note?: string;
  status: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  productId?: string;
  product?: Product;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}
