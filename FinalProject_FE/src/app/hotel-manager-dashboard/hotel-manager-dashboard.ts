
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';//it is used for angular directives like ngif,ngforn,ngclass,ngstyle
import { Router, RouterLink,RouterLinkActive,RouterOutlet } from '@angular/router';
import { UserService } from '../feature/services/user.service';
@Component({
  selector: 'app-hotel-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink,RouterLinkActive],
  templateUrl: './hotel-manager-dashboard.html',
  styleUrls: ['./hotel-manager-dashboard.css'],
})
export class HotelManagerDashboard {
  managerId: string | null = null;
 
  constructor(
    private userService : UserService,
    private router:Router,
 
  ) {}
 
  ngOnInit(): void {
    this.managerId = this.userService.getLoggedUserId();
    if(this.managerId===null)
    {
      this.router.navigate(['/login'])
    }
    console.log('Manager Dashboard loaded for manager:', this.managerId);
  }
}