import { Routes } from '@angular/router';

import { authGuard } from './auth.guard';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { UserDashboard } from './user-dashboard/user-dashboard';
import { HotelManagerDashboard } from './hotel-manager-dashboard/hotel-manager-dashboard';
import { MainLayout } from './main-layout/main-layout';
 
import { UpdateProfile } from './user-dashboard/update-profile/update-profile';
import { SearchHotel } from './user-dashboard/search-hotel/search-hotel';
 

import { HotelList } from './hotel-manager-dashboard/hotel-list/hotel-list';
import { RoomManagement } from './hotel-manager-dashboard/room-management/room-management';
import { RoomForm } from './hotel-manager-dashboard/room-form/room-form';
import { HotelForm } from './hotel-manager-dashboard/hotel-form/hotel-form';
import { Availability } from './hotel-manager-dashboard/availability/availability';
import { BookingStatus } from './hotel-manager-dashboard/booking-status/booking-status';
 
export const routes: Routes = [
 
  { path: 'login', component: Login },
  { path: 'register', component: Register },
 
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },
 
  
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      // --- user dashboard ---
      {
        path: 'user-dashboard',
        component: UserDashboard,
        children: [
          { path: '', redirectTo: 'search', pathMatch: 'full' }, // default Search
          { path: 'search', component: SearchHotel }, 

          {
            path: 'bookings',
            loadComponent: () =>
              import('./user-dashboard/user-bookings/user-bookings')
                .then(m => m.UserBookings),
          },
          {
            path: 'reviews',
            loadComponent: () =>
              import('./user-dashboard/add-review/add-review')
                .then(m => m.AddReview),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import('./user-dashboard/update-profile/update-profile')
                .then(m => m.UpdateProfile),
          },
          {
            path: 'hotel-details/:hotelId',
            loadComponent: () =>
              import('./user-dashboard/hotel-details/hotel-details')
                .then(m => m.HotelDetails),
          },
          {
            path: 'payment/:hotelId',
            loadComponent: () =>
              import('./user-dashboard/payment-ui/payment-ui')
                .then(m => m.PaymentUi),
          },
        ],
      },

 
      // --- admin---
      { path: 'admin-dashboard/:id', component: AdminDashboard },
 
      //----- Hotel manager dashboard -----
      {
        path: 'manager-dashboard',
        component: HotelManagerDashboard,
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          { path: 'profile', component: UpdateProfile },
          // Overview & My Hotels show the same list
          { path: 'overview', component: HotelList },
          { path: 'my-hotels', component: HotelList },
 
          // Rooms 
          { path: ':hotelId/rooms', component: RoomManagement },
          { path: ':hotelId/rooms/add', component: RoomForm },
          { path: ':hotelId/rooms/:roomId/edit', component: RoomForm },
 
          // Hotel profile
          { path: 'hotelprofile', component: HotelForm },
          { path: 'hotelprofile/add', component: HotelForm },
          { path: 'hotelprofile/:hotelId/update', component: HotelForm },
 
          // Availability
          { path: 'availability', component: Availability },
          { path: 'availability/:hotelId', component: Availability },
          { path: 'availability/:hotelId/:roomId', component: Availability },
 
          // Booking details
          { path: 'bookingdetails', component: BookingStatus },
 
          
          { path: '**', redirectTo: 'overview' },
        ],
      },
    ],
  },
 
  
  { path: '**', redirectTo: 'login' },
];