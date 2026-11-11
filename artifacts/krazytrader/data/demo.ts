import type { Dealer, MemberBenefit, Membership, Notification, Partner, Rider, SACCO, Vehicle } from '@/types/models';

export interface DemoVehicle extends Vehicle {
  image: number;
}

export const demoRider: Rider & { firstName: string } = {
  id: 'rider-demo-001',
  firstName: 'Amani',
  lastName: 'Mwangi',
  phone: '+254 700 123 456',
  county: 'Nakuru',
  town: 'Nakuru Town',
  saccoId: 'sacco-umoja',
  joinedAt: '2026-08-12T08:00:00.000Z',
};

export const demoSaccos: SACCO[] = [
  {
    id: 'sacco-umoja',
    name: 'Umoja Riders SACCO',
    county: 'Nakuru',
    town: 'Nakuru Town',
    memberCount: 860,
    monthlyContributionKes: 500,
  },
  {
    id: 'sacco-nairobi-boda',
    name: 'Nairobi Boda Network SACCO',
    county: 'Nairobi',
    town: 'Eastlands',
    memberCount: 1240,
    monthlyContributionKes: 650,
  },
  {
    id: 'sacco-coast-threewheel',
    name: 'Coast Three-Wheeler Cooperative',
    county: 'Mombasa',
    town: 'Mombasa Island',
    memberCount: 490,
    monthlyContributionKes: 550,
  },
  {
    id: 'sacco-eldoret-riders',
    name: 'Eldoret Riders Cooperative',
    county: 'Uasin Gishu',
    town: 'Eldoret',
    memberCount: 610,
    monthlyContributionKes: 500,
  },
];

export const demoSacco = demoSaccos[0];

export const demoMembership: Membership = {
  id: 'membership-demo-001',
  riderId: demoRider.id,
  saccoId: demoSacco.id,
  memberNumber: 'KT-NAK-02481',
  status: 'Active',
  createdAt: '2026-08-12T08:00:00.000Z',
  updatedAt: '2026-08-14T10:30:00.000Z',
  applicationReference: 'KT-APP-DEMO-02481',
  submittedAt: '2026-08-12T08:00:00.000Z',
  verificationStatus: 'Verified',
};

export const demoDealer: Dealer = {
  id: 'dealer-jua',
  name: 'Jua Mobility Centre',
  county: 'Nakuru',
  town: 'Nakuru Town',
  phone: '+254 711 222 333',
};

export const demoVehicles: DemoVehicle[] = [
  {
    id: 'cargo-trike-white',
    name: 'Big Boy Cargo Trike',
    category: 'Cargo tricycle',
    description: 'A practical three-wheel option for deliveries and everyday trade.',
    priceKes: 385000,
    dealerId: demoDealer.id,
    availability: 'Available',
    capacity: 'Up to 500 kg',
    image: require('../assets/products/cargo-trike-white.jpg'),
  },
  {
    id: 'passenger-trike-red',
    name: 'City Passenger Trike',
    category: 'Passenger tricycle',
    description: 'A three-wheel passenger option designed for town routes.',
    priceKes: 425000,
    dealerId: demoDealer.id,
    availability: 'Limited stock',
    capacity: 'Driver + 3 passengers',
    image: require('../assets/products/passenger-trike-red.jpg'),
  },
  {
    id: 'cargo-trike-green',
    name: 'Greenline Utility Trike',
    category: 'Cargo tricycle',
    description: 'An open-bed utility trike for local deliveries and small loads.',
    priceKes: 368000,
    dealerId: demoDealer.id,
    availability: 'Available',
    capacity: 'Up to 450 kg',
    image: require('../assets/products/cargo-trike-green.jpg'),
  },
];

export const demoPartners: Partner[] = [
  {
    id: 'partner-pamoja-fuel',
    name: 'Pamoja Fuel Stop',
    category: 'Fuel',
    county: 'Nakuru',
    town: 'Nakuru Town',
    description: 'Participating service station with member pricing.',
  },
  {
    id: 'partner-salama-tyres',
    name: 'Salama Tyre & Service',
    category: 'Tyres',
    county: 'Nakuru',
    town: 'Nakuru Town',
    description: 'Tyre, tube and puncture repair services for riders.',
  },
  {
    id: 'partner-imara-cover',
    name: 'Imara Rider Cover',
    category: 'Insurance',
    county: 'Nakuru',
    town: 'Nakuru Town',
    description: 'Rider-focused insurance information and assistance.',
  },
];

export const demoBenefits: MemberBenefit[] = [
  {
    id: 'benefit-fuel',
    partnerId: demoPartners[0].id,
    title: 'Member fuel price',
    description: 'Special member pricing at participating Pamoja stations.',
    category: 'Fuel',
    offerLabel: 'Member price',
    availableIn: 'Nakuru Town',
    active: true,
  },
  {
    id: 'benefit-tyres',
    partnerId: demoPartners[1].id,
    title: 'Tyre & repair savings',
    description: 'Reduced rates on selected tyres, tubes and puncture repairs.',
    category: 'Tyres',
    offerLabel: 'Save on service',
    availableIn: 'Nakuru Town',
    active: true,
  },
  {
    id: 'benefit-cover',
    partnerId: demoPartners[2].id,
    title: 'Rider cover guidance',
    description: 'Speak with a participating partner about available cover options.',
    category: 'Insurance',
    offerLabel: 'Member support',
    availableIn: 'Nakuru County',
    active: true,
  },
];

export const demoNotifications: Notification[] = [
  {
    id: 'notice-membership',
    title: 'Your membership is active',
    body: 'Umoja Riders SACCO has confirmed your KrazyTrader member profile.',
    type: 'Membership',
    createdAt: '2026-11-09T09:30:00.000Z',
  },
  {
    id: 'notice-benefit',
    title: 'A new rider benefit is available',
    body: 'Check the member benefits area for partner offers in Nakuru.',
    type: 'Benefit',
    createdAt: '2026-11-07T12:15:00.000Z',
  },
];

export const demoFinancingApplication = {
  id: 'finance-demo-001',
  riderId: demoRider.id,
  vehicleId: demoVehicles[0].id,
  requestedAmountKes: 300000,
  status: 'Draft' as const,
  createdAt: '2026-11-01T08:00:00.000Z',
  updatedAt: '2026-11-01T08:00:00.000Z',
};

export const demoSupportRequest = {
  id: 'support-demo-001',
  riderId: demoRider.id,
  subject: 'Membership information',
  category: 'Membership',
  status: 'Resolved' as const,
  createdAt: '2026-10-20T08:00:00.000Z',
  updatedAt: '2026-10-20T14:20:00.000Z',
};
