

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../feature/services/user.service';
import { User } from '../../shared/model/data.interface';
import { LoyaltyService } from '../../feature/services/loyaltyService';
import { CommonModule } from '@angular/common';
import { SearchCriteriaService } from '../../feature/services/search.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  userId: string = '';
  name: string = '';
  pointsBalance: number = 0;
  role: string = '';

  constructor(
    private userService: UserService,
    private loyaltyService: LoyaltyService,
    private router: Router,
    private searchService: SearchCriteriaService
  ) { }

  ngOnInit() {
    this.userId = this.userService.getLoggedUserId();
    this.role = this.userService.getRole();

    if (this.userId) {
      this.userService.getProfile().subscribe({
        next: (response: any) => {
          const serverRole = response.data.role;
          
          if (serverRole !== this.role) {
            alert('Session mismatch detected. Please login again.');
            this.onLogout();
            return;
          }

          if (response && response.data) {
            const userData = response.data;
            this.name = userData.name;
            this.userService.setName(this.name);

            if (this.role?.toLowerCase() === 'user') {
              this.loyaltyService.getPoints(this.userId).subscribe();
              this.loyaltyService.points$.subscribe(points => {
                this.pointsBalance = points;
              });
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          console.error('Navbar Profile Error:', err);
          if (err.status === 401) this.onLogout();
        }
      });
    }
  }

  onLogout() {
    this.userService.logout().subscribe({
      next: () => this.handlePostLogout(),
      error: (err: HttpErrorResponse) => {
        console.error('Logout failed:', err);
        this.handlePostLogout();
      }
    });
  }

  private handlePostLogout() {
    this.name = '';
    this.role = '';
    this.userId = '';
    this.searchService.clearCriteria();
    this.router.navigate(['/login']);
  }
}