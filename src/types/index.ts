export type UserRole = 'customer' | 'helper' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export type PaymentType = 'hourly' | 'fixed';

export type TaskStatus = 
  | 'searching' 
  | 'helper_assigned' 
  | 'in_progress' 
  | 'pending_confirmation' 
  | 'completed' 
  | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  rating: number;
  reviewCount: number;
  completedTasksCount: number;
  verificationStatus: VerificationStatus;
  isAvailable?: boolean;
  hourlyRate?: number;
  fixedRateDefault?: number;
  bio?: string;
  serviceRadiusKm?: number;
  skills?: string[]; // Category IDs or skill names
  certificateTitle?: string;
  certificateDocumentUrl?: string;
  idProofType?: string;
  joinedDate: string;
  earningsToday?: number;
  earningsWeek?: number;
  earningsTotal?: number;
}

export interface Category {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  icon: string; // lucide icon identifier
  isSkilled: boolean;
  qualificationRequired: boolean;
  qualificationNote: string;
  samplePriceDisplay: string;
  minPrice: number;
  maxPrice: number;
  rateType: PaymentType;
  popular?: boolean;
}

export interface Task {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  locationAddress: string;
  date: string;
  time: string;
  durationHours: number;
  paymentType: PaymentType;
  budget: number;
  status: TaskStatus;
  assignedHelperId?: string;
  assignedHelperName?: string;
  assignedHelperAvatar?: string;
  assignedHelperRating?: number;
  assignedHelperPhone?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  specialInstructions?: string;
  isPaid?: boolean;
  customerRated?: boolean;
}

export interface Review {
  id: string;
  taskId: string;
  taskTitle: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  helperId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Earning {
  id: string;
  helperId: string;
  taskId: string;
  taskTitle: string;
  categoryName: string;
  customerName: string;
  amount: number;
  date: string;
  status: 'credited' | 'processing';
  paymentMethod: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  taskId?: string;
  type: 'task' | 'verification' | 'system' | 'payment';
}
