
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../feature/services/booking.service copy';
import { HotelService } from '../../feature/services/hotel.service copy';
import { SelectedRoomsService } from '../../feature/services/rooms.service';
import { UserService } from '../../feature/services/user.service';
import { SearchCriteriaService } from '../../feature/services/search.service';
import { CommonModule } from '@angular/common';
import { LoyaltyService } from '../../feature/services/loyaltyService';

@Component({
  selector: 'app-payment-ui',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './payment-ui.html',
  styleUrls: ['./payment-ui.css'],
})
export class PaymentUi implements OnInit {
  hotelId!: string;
  userId!: string;
  pointsBalance = 0;
  redeemPoints = 0;
  discount = 0;
  isDiscountApplied = false;

  step = 1;
  booking = {
    checkInDate: '',
    checkOutDate: '',
    nights: 0,
    rooms: [] as any[],
    totalPrice: 0,
  };
  
  payment = { method: '', cardNumber: '', expiry: '', cvv: '' };
  guest = { name: '', email: '', contact: '' };

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private hotelService: HotelService,
    private selectedRoomsService: SelectedRoomsService,
    private userService: UserService,
    private searchCriteria: SearchCriteriaService,
    private router: Router,
    private loyaltyService: LoyaltyService
  ) {}

  ngOnInit() {
    this.hotelId = this.route.snapshot.paramMap.get('hotelId') || '';
    this.userId = this.userService.getLoggedUserId();
    this.booking.rooms = this.selectedRoomsService.getSelectedRooms() || [];

    this.calculateBookingSummary();

    this.loyaltyService.getPoints(this.userId).subscribe({
      next: (res) => this.pointsBalance = res.points,
      error: (err) => console.error('Failed to fetch points', err)
    });
  }

  /*Calculate original price before any discounts */
  private calculateBookingSummary() {
    const criteria = this.searchCriteria.getCriteria();
    if (criteria?.checkIn && criteria?.checkOut) {
      this.booking.checkInDate = criteria.checkIn;
      this.booking.checkOutDate = criteria.checkOut;
    }

    if (!this.booking.checkInDate || !this.booking.checkOutDate) return;

    const checkIn = new Date(this.booking.checkInDate);
    const checkOut = new Date(this.booking.checkOutDate);
    this.booking.nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24);

    this.booking.totalPrice = this.booking.rooms.reduce(
      (sum, r) => sum + r.price * r.quantity * this.booking.nights,
      0
    );
  }

  /** Getter to calculate final price reactively in the UI */
  get finalPrice(): number {
    return Math.max(0, this.booking.totalPrice - this.discount);
  }

  goToPayment() {
    this.step = 2;
  }

  /* Calculating discount without hitting the DB */
  applyPoints() {
    if (this.redeemPoints <= 0 || this.redeemPoints > this.pointsBalance) {
      alert('Please enter valid points to redeem.');
      return;
    }
    // Example: 100 points = ₹10 discount
    this.discount = this.redeemPoints / 10;
    this.isDiscountApplied = true;
    alert(`&#127881; Potential discount of ₹${this.discount} applied! Points will be deducted upon confirmation.`);
  }

  removeDiscount() {
    this.discount = 0;
    this.redeemPoints = 0;
    this.isDiscountApplied = false;
  }

  confirmPayment(paymentForm: NgForm) {
    if (!paymentForm.valid) return;

    const bookingEntry = {
      userId: this.userId,
      hotelId: this.hotelId,
      rooms: this.booking.rooms,
      checkInDate: this.booking.checkInDate,
      checkOutDate: this.booking.checkOutDate,
      nights: this.booking.nights,
      totalAmount: this.finalPrice, 
      status: 'Pending' as const,
      paymentId: 'PAY-' + Date.now(), 
    };

    this.bookingService.addBooking(bookingEntry).subscribe({
      next: (res) => {
        //Redeem points
        if (this.isDiscountApplied && this.redeemPoints > 0) {
          this.loyaltyService.redeemPoints(this.userId, this.redeemPoints).subscribe();
        }

        // Earned new points based on payment
        const earnedPoints = Math.floor(this.finalPrice / 10);
        this.loyaltyService.addPoints(this.userId, earnedPoints).subscribe({
          next: (loyaltyRes) => {
            alert(`Booking successful! Paid: ₹${this.finalPrice}. Earned: ${earnedPoints} points.`);
            this.router.navigate(['user-dashboard/bookings']);
          }
        });
      },
      error: (err) => {
        console.error('Booking failed', err);
        alert('Payment failed. No points were deducted.');
      }
    });
  }
}