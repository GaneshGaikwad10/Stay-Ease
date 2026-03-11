
// hotelModel.ts
export interface Room {
  roomId: string;
  type: 'Standard' | 'Deluxe' | 'Executive' | 'Suite'| "";
  price: number;
  capacityAdults: number;
  capacityChildren: number;
  status: 'Available' | 'Occupied' | 'Maintenance'| "";
  features: string[];
  image?: string;
  unavailableDates: string[];
}

export interface Hotel {
  hotelId: string;
  managerId: string;
  name: string;
  location: string;
  address: string;
  description: string;
  rating: number;
  grade : number | null;
  reviews?: { userId: string; userName: string; reviewText: string; rating: number }[];
  amenities: string[];
  image: string;
  rooms: Room[];
}

// bookingModel.ts
export interface BookingRoom {
  roomId: string;
  type: string;
  price: number;
  quantity: number;
}

export interface Booking {
  _id?: string,
  bookingId? : string;
  userId: string;
  hotelId: string;
  rooms: BookingRoom[];
  checkInDate: string;   // ISO date string
  checkOutDate: string;  // ISO date string
  nights: number;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rejected';
  paymentId: string | null;
}


// userModel.ts
export type UserRole = 'user' | 'admin' | 'hotel manager';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: number;
  password: string;
  role: UserRole;
  isActive: boolean;
  location?: string; // optional for admins/managers
}
