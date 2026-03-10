import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../feature/services/user.service';


@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports : [CommonModule,RouterOutlet,RouterModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboard {
  userId: string | null = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    
    this.userId = this.userService.getLoggedUserId();
    console.log('User Dashboard loaded for user:', this.userId);
  }
}


