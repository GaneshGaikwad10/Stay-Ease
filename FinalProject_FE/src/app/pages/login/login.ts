
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../feature/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  
  onLogin() {
  const credentials = { email: this.email, password: this.password };

  this.userService.login(credentials).subscribe({
    next: (res) => {
      if (res.success) {
        const role = res.data.role;
        const userId = res.data.id || res.data._id;
        
        this.userService.setLoggedUser(userId, role);

        switch (role.toLowerCase()) {
          case 'user': 
            this.router.navigate(['/user-dashboard']); 
            break;
          case 'admin': 
            this.router.navigate(['/admin-dashboard', userId]); 
            break;
          case 'hotel manager': 
            this.router.navigate(['/manager-dashboard']); 
            break;
          default:
            this.router.navigate(['/']);
        }
      }
    },
    error: (err: HttpErrorResponse) => {
      alert(err.error?.message || 'Login failed. Please check your credentials.');
    }
  });
}
}
