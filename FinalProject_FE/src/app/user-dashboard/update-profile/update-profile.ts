import { Component } from '@angular/core';
import { UserService } from '../../feature/services/user.service';
import { Router } from '@angular/router';
import { User } from '../../shared/model/data.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './update-profile.html',
  styleUrl: './update-profile.css',
})
export class UpdateProfile {
  selectedUser!: User;
 
 
  constructor(
    private userService: UserService,
    private router: Router
  ) {}
 
 
ngOnInit(): void {
  const loggedId = this.userService.getLoggedUserId();
  if (!loggedId) {
    this.router.navigate(['/login']);
    return;
  }
 
  // Using the /me endpoint
  this.userService.getProfile().subscribe({
    next: (res) => {
      this.selectedUser = { ...res.data };
    },
    error: (err) => {
      console.error('Profile Load Error:', err);
      if (err.status === 401 || err.status === 403) {
        this.router.navigate(['/login']);
      }
    }
  });
}
 
  saveProfile() {
    // Send the updated data to the backend
    this.userService.updateProfile(this.selectedUser).subscribe({
      next: (res) => {
        alert('Your profile has been updated!');
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert('Failed to update profile. Please try again.');
      }
    });
  }
}