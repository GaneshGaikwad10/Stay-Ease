import { Component } from '@angular/core';
import { BookingService } from '../../feature/services/booking.service copy';
import { HotelService } from '../../feature/services/hotel.service copy';
import { UserService } from '../../feature/services/user.service';
import { Booking, Hotel } from '../../shared/model/data.interface';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-bookings.html',
  styleUrls: ['./user-bookings.css'],
})
export class UserBookings {
  userBookings: (Booking & { hotel?: Hotel })[] = [];
  hotelfound: boolean = false;

  constructor(
    private bookingService: BookingService,
    private hotelService: HotelService,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  /** Load all bookings for the logged-in user */
  private loadBookings() {
    const userId = this.userService.getLoggedUserId();

    this.bookingService.getBookingsByUser(userId).subscribe({
      next: (bookings) => {
        this.userBookings = bookings;
        this.attachHotels();
        this.updateStatuses();
        this.cd.detectChanges();
      },
      error: (err) => console.error('Failed to fetch bookings', err)
    });
  }

  /** Attach hotel details to each booking */
  private attachHotels() {
    this.userBookings.forEach(b => {
      this.hotelService.getHotelById(b.hotelId).subscribe(hotel => {
        b.hotel = hotel;
        this.cd.detectChanges();
        this.hotelfound = true;
      });
    });
  }

  /** Update booking statuses based on check-out date */
  private updateStatuses() {
    const today = new Date();
    this.userBookings.forEach(b => {
      const checkOutDate = new Date(b.checkOutDate);
      if (b.status === 'Confirmed' && checkOutDate < today) {
        b.status = 'Completed';
      }
    });
  }

  /** Cancel a booking if allowed */
  cancelBooking(booking: Booking) {
    const now = new Date();
    const checkIn = new Date(booking.checkInDate);

    const diffInMs = checkIn.getTime() - now.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours >= 24) {
      this.bookingService.cancelBooking(booking._id||"").subscribe({
        next: () => {
          booking.status = 'Cancelled';
          alert('Booking cancelled successfully.');
        },
        error: (err) => {
          console.error('Cancel failed', err);
          alert('Could not cancel booking. Please try again.');
        }
      });
    } else {
      alert('Bookings can only be cancelled up to 24 hours before check-in.');
    }
  }
}
