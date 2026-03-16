

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../feature/services/booking.service copy';
import { UserService } from '../../feature/services/user.service';
import { Booking } from '../../shared/model/data.interface'; // Ensure correct path
import { LoyaltyService } from '../../feature/services/loyaltyService';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-booking-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-status.html',
  styleUrls: ['./booking-status.scss'],
})
export class BookingStatus implements OnInit {
  bookingDetails: Booking[] = [];

  constructor(
    private bookingSvc: BookingService,
    private userSvc: UserService,
    private loyaltySvc: LoyaltyService
  ) { }

  ngOnInit(): void {
    this.loadManagerBookings();
  }



  loadManagerBookings(): void {
    const managerId = this.userSvc.getLoggedUserId();
    console.log('Front-end Manager ID:', managerId);

    if (!managerId) {
      console.warn('No manager ID found! User might not be logged in.');
      return;
    }

    this.bookingSvc.getBookingsByManager(managerId).subscribe({
      next: data => {
        console.log('Bookings received from server:', data);
        this.bookingDetails = data;
      },
      error: err => console.error('Could not load bookings', err)
    });
  }


  //here id is bookingId
  confirmStatus(id: string): void {

    console.log(id);
    this.bookingSvc.acceptBooking(id).subscribe({
      next: () => {
        this.loadManagerBookings();
      },
      error: (err) => alert('Error confirming booking')
    });
  }


  rejectStatus(id: string): void {


    if (confirm('Are you sure you want to reject this booking?')) {
      this.bookingSvc.rejectBooking(id).pipe(
        // After rejecting, fetch the booking details
        switchMap(() => this.bookingSvc.getBookingById(id)),
        // After getting details, add the points if necessary
        switchMap((booking) => {
          const refundedPoints = booking.discount || 0;
          if (refundedPoints > 0) {
            return this.loyaltySvc.addPoints(booking.userId, refundedPoints);
          }
          // If no points to refund, just return an "empty" observable to keep the chain alive
          return of(null);
        })
      ).subscribe({
        next: () => {
          console.log('Process complete');
          this.loadManagerBookings();
        },
        error: (err) => {
          console.error('Error in sequence:', err);
          alert('Failed to complete the rejection/refund process');
        }
      });
    }
  }

  maskId(id?: string): string {
    if (!id) return '';

    const s = String(id);
    if (s.length <= 5) return s; // if ID is too short, don't mask

    const first2 = s.slice(0, 2);
    const last3 = s.slice(-3);

    return `${first2}*****${last3}`;
  }
}

