import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/review';

  constructor(private http: HttpClient) {}

  // Get all reviews for a hotel
  getReviewsByHotel(hotelId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${hotelId}`);
  }

  // Add a new review
  addReview(payload: {
    userId: string;
    userName: string;
    hotelId: string;
    reviewText: string;
    rating: number;
  }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
}
