
import { Injectable } from '@angular/core';
import { Booking } from '../../shared/model/data.interface';
import { BookingsData } from '../../shared/data/data';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings: Booking[] = BookingsData;
  private apiUrl = 'http://localhost:3000/api/booking';

  constructor(private http: HttpClient) { }

  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  getBookingByHotelId(hotelId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/hotel/${hotelId}`);
  }

  getBookingsByUser(userId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/user/${userId}`);
  }

  addBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  updateBookingStatus(bookingId: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/status/${bookingId}`, { status });
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.updateBookingStatus(bookingId, 'Cancelled');
  }

  rejectBooking(bookingId: string): Observable<any> {
    return this.updateBookingStatus(bookingId, 'Rejected');
  }

  acceptBooking(bookingId: string): Observable<any> {
    return this.updateBookingStatus(bookingId, 'Confirmed');
  }

  completeBooking(bookingId: string): Observable<any> {
    return this.updateBookingStatus(bookingId, 'Completed');
  }

  getBookingsByManager(managerId: string) {
    return this.http.get<any[]>(`http://localhost:3000/api/booking/manager/${managerId}`);
  }

}
