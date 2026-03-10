
import { Component } from '@angular/core';
import { Booking, Hotel } from '../../shared/model/data.interface';
import { BookingService } from '../../feature/services/booking.service copy';
import { HotelService } from '../../feature/services/hotel.service copy';
import { UserService } from '../../feature/services/user.service';
import { ReviewService } from '../../feature/services/review.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-review.html',
  styleUrls: ['./add-review.css'],
})
export class AddReview {
  completedBookings: (Booking & { hotel?: Hotel })[] = [];
  expandedHotelId: string | null = null;

  newReviewText: string = '';
  newRating: number = 0;
  userId: string = '';

  constructor(
    private bookingService: BookingService,
    private hotelService: HotelService,
    private userService: UserService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.userId = this.userService.getLoggedUserId();

    // Fetch bookings from backend
    this.bookingService.getBookingsByUser(this.userId).subscribe({
      next: (bookings: Booking[]) => {
        const completed = bookings.filter(b => b.status.toLowerCase() === 'completed');

        completed.forEach(b => {
          this.hotelService.getHotelById(b.hotelId).subscribe(hotel => {
            // Fetch reviews for this hotel
            this.reviewService.getReviewsByHotel(hotel.hotelId).subscribe(res => {
              hotel.reviews = res.reviews;
              hotel.rating = res.rating;
              this.completedBookings.push({ ...b, hotel });
            });
          });
        });
      },
      error: err => console.error('Failed to fetch bookings', err)
    });
  }

  toggleHotel(hotelId: string | undefined) {
    if (!hotelId) return;
    this.expandedHotelId = this.expandedHotelId === hotelId ? null : hotelId;
    this.newReviewText = '';
    this.newRating = 0;
  }

  setRating(star: number) {
    this.newRating = star;
  }

  hasUserReviewed(hotel: Hotel | undefined): boolean {
    if (!hotel || !hotel.reviews) return false;
    // Check if any review in the hotel's review list matches the current userId
    return hotel.reviews.some((review: any) => review.userId === this.userId);
  }

  addReview(hotel: Hotel) {
    if (!this.newReviewText || this.newRating === 0) {
      alert('Please add text and select a rating.');
      return;
    }

    const payload = {
      userId: this.userId,
      userName: this.userService.getName(), 
      hotelId: hotel.hotelId,
      reviewText: this.newReviewText,
      rating: this.newRating
    };

    this.reviewService.addReview(payload).subscribe({
      next: (res) => {
        
        hotel.reviews = res.reviews || [...(hotel.reviews || []), res.review];
        hotel.rating = res.updatedHotelRating;

        this.newReviewText = '';
        this.newRating = 0;

        alert(`Review added successfully for ${hotel.name}! &#127881; You earned ${res.pointsEarned} points. Total: ${res.totalPoints}`);
      },
      error: (err) => {
        alert(err.error?.message || 'Could not add review. Please try again.');
      }
    });
  }
}
