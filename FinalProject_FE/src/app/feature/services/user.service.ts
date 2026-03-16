
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../../shared/model/data.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private loggedUserId: string = "";
  private name: string = "";
  private role: string = "";

  constructor(private http: HttpClient) { }

  // AUTHENTICATION
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res.success) this.loggedUserId = res.data.id;
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  logout(): Observable<any> {
    this.loggedUserId = '';
    sessionStorage.removeItem('userId');
    return this.http.post(`${this.apiUrl}/auth/logout`, {});
  }

  // USER PROFILE
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/me`);
  }

  updateProfile(data: Partial<User>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/me`, data);
  }

  setLoggedUser(id: string, role: string) {
    this.loggedUserId = id;
    this.role = role;
    sessionStorage.setItem('userId', id);
    sessionStorage.setItem('userRole', role); // Store role to compare later
  }

  getLoggedUserId(): string {
    if (!this.loggedUserId) {
      this.loggedUserId = sessionStorage.getItem('userId') || '';
    }
    return this.loggedUserId;
  }

  getRole(): string {
    if (!this.role) {
      this.role = sessionStorage.getItem('userRole') || '';
    }
    return this.role;
  }
  

  setName(name: string) { this.name = name }
  getName(): string { return this.name };


  // Fetch all users from Backend (Admin only)
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users`);
  }

  //  Update any user by ID (Admin only)
  updateUserById(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/user/${id}`, data);
  }

  // Delete a user (Admin only)
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }


  getUserProfile(id: string): Observable<any> {

    return this.http.get(`${this.apiUrl}/user/${id}`);
  }
}

