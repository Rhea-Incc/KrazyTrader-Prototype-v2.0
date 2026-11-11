export type MembershipStatus = 'Submitted' | 'Pending verification' | 'Active' | 'Rejected' | 'Inactive';
export type VerificationStatus = 'Not started' | 'Pending' | 'Verified' | 'Needs update';
export type VehicleCategory = 'Two-wheeler' | 'Three-wheeler';

export interface Rider {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  county: string;
  town: string;
  saccoId: string;
  joinedAt: string;
  email?: string;
  dateOfBirth?: string;
  occupation?: string;
  vehicleCategory?: VehicleCategory;
}

export interface SACCO {
  id: string;
  name: string;
  county: string;
  town: string;
  memberCount: number;
  monthlyContributionKes: number;
}

export interface Membership {
  id: string;
  riderId: string;
  saccoId: string;
  memberNumber: string;
  status: MembershipStatus;
  createdAt: string;
  updatedAt: string;
  applicationReference?: string;
  submittedAt?: string;
  verificationStatus?: VerificationStatus;
  demoIdentityReference?: string;
  documentPlaceholder?: string;
  rejectionReason?: string;
  termsAcceptedAt?: string;
  declarationAcceptedAt?: string;
}

export interface Dealer {
  id: string;
  name: string;
  county: string;
  town: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  name: string;
  category: 'Cargo tricycle' | 'Passenger tricycle' | 'Motorcycle';
  description: string;
  priceKes: number;
  dealerId: string;
  availability: 'Available' | 'Limited stock' | 'Coming soon';
  capacity: string;
}

export interface VehicleInquiry {
  id: string;
  riderId: string;
  vehicleId: string;
  status: 'Draft' | 'Submitted' | 'Contacted' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface FinancingApplication {
  id: string;
  riderId: string;
  vehicleId: string;
  requestedAmountKes: number;
  status: 'Draft' | 'Submitted' | 'Under review' | 'Approved' | 'Declined';
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  name: string;
  category: 'Fuel' | 'Tyres' | 'Repairs' | 'Insurance' | 'Emergency';
  county: string;
  town: string;
  description: string;
}

export interface MemberBenefit {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  category: Partner['category'];
  offerLabel: string;
  availableIn: string;
  active: boolean;
}

export interface SupportRequest {
  id: string;
  riderId: string;
  subject: string;
  category: string;
  status: 'Open' | 'In progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'Membership' | 'Vehicle' | 'Benefit' | 'Support';
  createdAt: string;
  readAt?: string;
}

export type RiderNotification = Notification;
