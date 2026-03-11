
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../feature/services/user.service';
import { User } from '../../shared/model/data.interface';
import { LoyaltyService } from '../../feature/services/loyaltyService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  userId: string = '';
  user: User | null = null;
  name: string = '';
  pointsBalance: number = 0;
  role: string = '';   

  constructor(
    private userService: UserService,
    private loyaltyService: LoyaltyService,
    private router: Router
  ) { }

  // navbar.ts
  ngOnInit() {
    this.userId = this.userService.getLoggedUserId();

    if (this.userId) {
      this.userService.getProfile().subscribe({
        next: (response: any) => {
          if (response && response.data) {
            const userData = response.data;
            this.role = userData.role;
            this.name = userData.name;
            this.userService.setName(this.name);

            if (this.role?.toLowerCase() === 'user') {
              // Initial fetch to populate the Subject
              this.loyaltyService.getPoints(this.userId).subscribe();

              // Subscribe to the stream for all future updates
              this.loyaltyService.points$.subscribe(points => {
                this.pointsBalance = points;
              });
            }
          }
        }
      });
    }
  }

  onLogout() {
    this.userService.logout().subscribe({
      next: () => {
        this.name = '';
        this.role = '';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.router.navigate(['/login']);
      }
    });
  }

}
