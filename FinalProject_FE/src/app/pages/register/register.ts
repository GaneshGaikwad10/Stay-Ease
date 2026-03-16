import { Component, OnInit } from '@angular/core';
import { UserService } from '../../feature/services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule,NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  isRegistered = false;
  registerForm!: FormGroup;
 
  // Indian States and Cities Data
  statesData: { [key: string]: string[] } = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"]
  };

  states: string[] = Object.keys(this.statesData);
  cities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}
 
 
  ngOnInit() {
  this.registerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    age: ['', [Validators.required, Validators.min(18), Validators.max(70)]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],  
    role: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Listen for state changes to update city list
    this.registerForm.get('state')?.valueChanges.subscribe((stateName) => {
      this.cities = this.statesData[stateName] || [];
      this.registerForm.get('city')?.reset(); // Reset city when state changes
    });
  }

  get f() {
    return this.registerForm!.controls;
  }
 

  handleRegister() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
 
      const newUser = {
        name: formValue.fullName,
        email: formValue.email,
        phone: Number(formValue.phone) || 0,
        password: formValue.password,
        role: formValue.role.toLowerCase().trim(),
        isActive: formValue.role.toLowerCase() === 'hotel manager' ? false : true,
        location: `${formValue.city}, ${formValue.state}`
      };
 
      // Call the service and SUBSCRIBE
      this.userService.register(newUser).subscribe({
        next: (res) => {
          console.log('User registered successfully:', res);
          this.isRegistered = true; // Shows the success message in HTML
         
          if(res.data && res.data.id) {
            this.userService.setLoggedUser(res.data.id, res.data.role);
          }
        },
        error: (err) => {
          console.error('Registration failed:', err);
          // If user email already exists, backend sends error
          alert(err.error.message || 'Registration failed. Try again.');
        }
      });
    }
  }
 
  goToLogin() {
    this.router.navigate(['/login']);
  }
}