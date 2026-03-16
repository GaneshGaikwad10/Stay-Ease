
import { Component, OnInit } from '@angular/core';
import { Booking, Hotel } from '../../shared/model/data.interface';
import { BookingService } from '../../feature/services/booking.service copy';
import { HotelService } from '../../feature/services/hotel.service copy';
import { UserService } from '../../feature/services/user.service';
import { ReviewService } from '../../feature/services/review.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoyaltyService } from '../../feature/services/loyaltyService';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-review.html',
  styleUrls: ['./add-review.css'],
})
export class AddReview implements OnInit {
  completedBookings: (Booking & { hotel?: Hotel })[] = [];
  expandedHotelId: string | null = null;

  newReviewText: string = '';
  newRating: number = 0;
  userId: string = '';

  constructor(
    private bookingService: BookingService,
    private hotelService: HotelService,
    private userService: UserService,
    private reviewService: ReviewService,
    private loyaltyService: LoyaltyService
  ) { }

  ngOnInit() {
    this.userId = this.userService.getLoggedUserId();

    this.bookingService.getBookingsByUser(this.userId).subscribe({
      next: (bookings: Booking[]) => {
        // 1. Get only completed bookings
        const completed = bookings.filter(b => b.status.toLowerCase() === 'completed');

        // 2. Use a Set or a Map to keep track of unique hotelIds we've already added
        const seenHotels = new Set<string>();

        completed.forEach(b => {
          // Only proceed if we haven't processed this hotel yet
          if (!seenHotels.has(b.hotelId)) {
            seenHotels.add(b.hotelId);

            this.hotelService.getHotelById(b.hotelId).subscribe(hotel => {
              this.reviewService.getReviewsByHotel(hotel.hotelId).subscribe(res => {
                hotel.reviews = res.reviews;
                hotel.rating = res.rating;
                this.completedBookings.push({ ...b, hotel });
              });
            });
          }
        });
      },
      error: err => console.error('Failed to fetch bookings', err)
    });
  }

  getButtonText(hotel: Hotel | undefined): string {
    if (!hotel) return 'Details';
    if (this.expandedHotelId === hotel.hotelId) return 'Close';
    return this.hasUserReviewed(hotel) ? 'View Your Review' : 'Rate Your Stay';
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
        this.loyaltyService.addPoints(this.userId, 50).subscribe();
        alert(`Review added successfully for ${hotel.name}!`);
      },
      error: (err) => alert(err.error?.message || 'Error adding review.')
    });
  }
}