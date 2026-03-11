
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoyaltyService {
  private apiUrl = 'http://localhost:3000/api/loyalty';
  
  // Create a stream for points
  private pointsSubject = new BehaviorSubject<number>(0);
  points$ = this.pointsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch and update the stream
  getPoints(userId: string): Observable<{ points: number }> {
    return this.http.get<{ points: number }>(`${this.apiUrl}/${userId}`).pipe(
      tap(res => this.pointsSubject.next(res.points))
    );
  }

  updatePoints(userId: string, amount: number, action: 'add' | 'redeem'): Observable<{ points: number }> {
    return this.http.patch<{ points: number }>(`${this.apiUrl}/${userId}`, { amount, action }).pipe(
      tap(res => this.pointsSubject.next(res.points)) // Push new value to all subscribers
    );
  }

  addPoints(userId: string, amount: number): Observable<{ points: number }> {
    return this.updatePoints(userId, amount, 'add');
  }

  redeemPoints(userId: string, amount: number): Observable<{ points: number }> {
    return this.updatePoints(userId, amount, 'redeem');
  }
}