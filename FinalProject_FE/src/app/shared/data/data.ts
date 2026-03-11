import { Hotel } from "../model/data.interface";
import { Booking } from "../model/data.interface";
import { User } from "../model/data.interface";

export const Hotels: Hotel[] = [
  {
    hotelId: 'h1',
    managerId: '2',
    name: 'Grand Plaza Hotel',
    location: 'New Delhi',
    address: 'Connaught Place, New Delhi, India',
    description: 'World-class amenities and personalized service in the heart of Delhi.',
    rating: 4.5,
    amenities: ['WiFi', 'Pool', 'Gym', 'Parking', 'Restaurant'],
    image: 'assets/hotels/1.jpg',
    grade: 3,
    rooms: [
      {
        roomId: 'r101',
        type: 'Deluxe',
        price: 500,
        capacityAdults: 2,
        capacityChildren: 1,
        status: 'Available',
        features: ['King Bed', 'City View', 'Work Desk'],
        image: '',
        unavailableDates: ['2026-01-20', '2026-01-21']
      },
      {
        roomId: 'r102',
        type: 'Suite',
        price: 900,
        capacityAdults: 3,
        capacityChildren: 2,
        status: 'Available',
        features: ['2 Bedrooms', 'Living Room', 'Kitchenette'],
        image: '',
        unavailableDates: []
      },
      {
        roomId: 'r103',
        type: 'Executive',
        price: 700,
        capacityAdults: 2,
        capacityChildren: 1,
        status: 'Maintenance',
        features: ['Queen Bed', 'Work Desk'],
        image: '',
        unavailableDates: ['2026-01-22']
      }
    ],
    reviews: [
      // { userId: '1', userName: 'Bob Smith', reviewText: 'Great stay, excellent service!', rating: 5 },
      { userId: '2', userName: 'Alice Freeman', reviewText: 'Rooms were clean but a bit small.', rating: 4 }
    ]
  },
  {
    hotelId: 'h2',
    managerId: '2',
    name: 'Sunset Beach Resort',
    location: 'Goa',
    address: 'Calangute Beach Road, Goa, India',
    description: 'Beachfront resort with stunning Arabian Sea views.',
    rating: 4.0,
    grade: 3,
    amenities: ['WiFi', 'Pool', 'Beach Access', 'Bar'],
    image: 'assets/hotels/2.jpg',
    rooms: [
      {
        roomId: 'r201',
        type: 'Standard',
        price: 500,
        capacityAdults: 2,
        capacityChildren: 1,
        status: 'Available',
        features: ['Queen Bed', 'Balcony'],
        image: '',
        unavailableDates: []
      },
      {
        roomId: 'r202',
        type: 'Deluxe',
        price: 700,
        capacityAdults: 2,
        capacityChildren: 2,
        status: 'Available',
        features: ['King Bed', 'Sea View'],
        image: '',
        unavailableDates: ['2026-01-18', '2026-01-19']
      }
    ],
    reviews: [
      { userId: '2', userName: 'Alice Freeman', reviewText: 'Loved the beach view, but service was slow.', rating: 3 },
      { userId: '1', userName: 'Bob Smith', reviewText: 'Perfect location for a family vacation!', rating: 5 }
    ]
  },
  {
    hotelId: 'h3',
    managerId: '2',
    name: 'Mountain View Lodge',
    location: 'Manali',
    address: 'Hadimba Road, Manali, Himachal Pradesh, India',
    description: 'Luxury alpine living with breathtaking Himalayan views.',
    rating: 5.0,
    grade: 3,
    amenities: ['WiFi', 'Spa', 'Gym', 'Parking'],
    image: 'assets/hotels/3.jpg',
    rooms: [
      {
        roomId: 'r301',
        type: 'Suite',
        price: 1000,
        capacityAdults: 3,
        capacityChildren: 2,
        status: 'Available',
        features: ['Fireplace', 'Mountain View'],
        image: '',
        unavailableDates: []
      }
    ],
    reviews: [
      { userId: '1', userName: 'Bob Smith', reviewText: 'Amazing mountain views, worth every penny!', rating: 5 }
    ]
  },
  {
    hotelId: 'h4',
    managerId: '2',
    name: 'Goa Paradise Inn',
    location: 'Goa',
    address: 'Baga Beach Road, Goa, India',
    description: 'Affordable stay with vibrant nightlife nearby.',
    rating: 3.8,
    grade: 3,
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Parking'],
    image: 'assets/hotels/4.jpg',
    rooms: [
      {
        roomId: 'r401',
        type: 'Standard',
        price: 500,
        capacityAdults: 2,
        capacityChildren: 1,
        status: 'Available',
        features: ['Double Bed', 'Balcony'],
        image: '',
        unavailableDates: []
      }
    ],
    reviews: [
      { userId: '1', userName: 'Bob Smith', reviewText: 'Great budget option near the beach.', rating: 4 }
    ]
  },
  {
    hotelId: 'h5',
    managerId: '2',
    name: 'Goa Luxury Retreat',
    location: 'Goa',
    address: 'Candolim Beach Road, Goa, India',
    description: 'Premium resort with private beach access.',
    rating: 4.7,
    grade: 3,
    amenities: ['WiFi', 'Pool', 'Spa', 'Private Beach', 'Restaurant'],
    image: 'assets/hotels/5.jpg',
    rooms: [
      {
        roomId: 'r501',
        type: 'Suite',
        price: 1200,
        capacityAdults: 4,
        capacityChildren: 2,
        status: 'Available',
        features: ['Sea View', 'Jacuzzi', 'Private Balcony'],
        image: '',
        unavailableDates: []
      }
    ],
    reviews: [
      { userId: '2', userName: 'Alice Freeman', reviewText: 'Loved the private beach and spa!', rating: 5 }
    ]
  }
];

export const BookingsData: Booking[] = [
  {
    bookingId: "B1737289999999",
    userId: '1',
    hotelId: "h1",
    rooms: [
      { roomId: "R101", type: "Deluxe", price: 500 , quantity:1},
      { roomId: "R102", type: "Suite", price: 900,quantity:1 }
    ],
    checkInDate: "2026-01-10",
    checkOutDate: "2026-01-13",
    nights: 3,
    status: "Completed",
    paymentId: null,
    totalAmount: 4200
  },
  {
    bookingId: "B1737289999998",
    userId: '1',
    hotelId: "h2",
    rooms: [
      { roomId: "r201", type: "Standard", price: 500 ,quantity:1},
      { roomId: "r202", type: "Deluxe", price: 700 , quantity:1}
    ],
    checkInDate: "2026-01-20",
    checkOutDate: "2026-01-23",
    nights: 3,
    status: "Completed",
    paymentId: null,
    totalAmount: 3600
  }
];

export const userData: User[] = [
  { id: '1', name: 'Bob Smith', email: 'bob@yahoo.com', phone: 9345678123, password: 'user123', role: 'user' as const, isActive: true },
  { id: '2', name: 'Alice Freeman', email: 'alice@gmail.com', phone: 8765432190, password: 'manager123', role: 'hotel manager' as const, isActive: true },
  { id: '3', name: 'Sarah Chen', email: 'admin@hotel.com', phone: 1234567890, password: 'admin123', role: 'admin' as const, isActive: true, location: 'HQ-London' },
  { id: '4', name: 'James Wilson', email: 'jw@hotel.com', phone: 9123456789, password: 'password123', role: 'admin' as const, isActive: true, location: 'HQ-New York' },
  { id: '5', name: 'Elena Rodriguez', email: 'manager1@hotel.com', phone: 9876543210, password: 'manager123', role: 'hotel manager' as const, isActive: false, location: 'Madrid Branch' }
];
