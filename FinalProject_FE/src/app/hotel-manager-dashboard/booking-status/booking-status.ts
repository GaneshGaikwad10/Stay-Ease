

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../feature/services/booking.service copy';
import { UserService } from '../../feature/services/user.service';
import { Booking } from '../../shared/model/data.interface'; // Ensure correct path

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
    private userSvc: UserService
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
      this.bookingSvc.rejectBooking(id).subscribe({
        next: () => {
          this.loadManagerBookings();
        },
        error: (err) => alert('Error rejecting booking')
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

