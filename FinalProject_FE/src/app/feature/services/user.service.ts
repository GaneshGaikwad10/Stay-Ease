import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../../shared/model/data.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api';
  private loggedUserId: string = "";

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        if (res.success && res.data.id) {
          this.setLoggedUser(res.data.id); 
        }
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

logout(): Observable<any> {
  sessionStorage.clear(); // Clear the ID
  this.loggedUserId = "";  // Reset the variable
  return this.http.post(`${this.apiUrl}/auth/logout`, {});
}

getProfile(): Observable<any> {
  return this.http.get(`${this.apiUrl}/user/me`);
}

updateProfile(data: Partial<User>): Observable<any> {
  return this.http.patch(`${this.apiUrl}/user/me`, data);
}

setLoggedUser(id: string){ 
    this.loggedUserId = id; 
    sessionStorage.setItem('userId', id); // Keep ID on page refresh
  }
getLoggedUserId(): string {
    if (!this.loggedUserId) {
      this.loggedUserId = sessionStorage.getItem('userId') || "";
    }
     return this.loggedUserId; 
    }

// Fetch all users (Admin only)
getAllUsers(): Observable<any> {
  return this.http.get(`${this.apiUrl}/admin/users`);
}

// Update any user by ID (Admin only)
updateUserById(id: string, data: any): Observable<any> {
  return this.http.patch(`${this.apiUrl}/user/${id}`, data, { withCredentials: true });
}

// Delete a user 
deleteUser(id: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/user/${id}`, { withCredentials: true });
}

getUserProfile(id: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/user/${id}`);
}
}