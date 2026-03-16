
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
  previousUser: string = '';
 
 
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
      this.previousUser = JSON.stringify(this.selectedUser);
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
if (JSON.stringify(this.selectedUser) === this.previousUser) {
      alert('No updates were made as the information provided is the same as your current profile');
      return;
    }

    if (!this.selectedUser.name || this.selectedUser.name.length < 3) {
      alert('Please enter a valid name (at least 3 characters).');
      return;
    }
 
    const phoneStr = this.selectedUser.phone?.toString() || '';
    const phoneRegex = /^[0-9]{10}$/;
   
    if (!phoneRegex.test(phoneStr)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }
 
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
   
    const emailValue = (this.selectedUser.email || "").toLowerCase().trim();
 
    if (!emailValue || !emailRegex.test(emailValue)) {
      alert('Please enter a valid email address ending in at least 3 characters (e.g., .com, .org).');
      return;
    }
 
    // If all pass, proceed to service call
    this.userService.updateProfile(this.selectedUser).subscribe({
      next: (res) => {
        alert('Your profile has been updated!');
      },
      error: (err) => {
        console.error('Update failed:', err);
        alert(err.error?.message || 'Failed to update profile.');
      }
    });
}
}