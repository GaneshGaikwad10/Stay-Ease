
import { Component, OnInit } from '@angular/core';
import { User } from '../shared/model/data.interface';
import { UserService } from '../feature/services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  
  userList: User[] = [];
  counter: number = 0;
  filterCriteria: string = 'all';

  showDeleteModal: boolean = false;
  userToDelete: User | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Helper to refresh the list from the database
  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.userList = res.data; 
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  get filteredUserList(): User[] {
    if (this.filterCriteria === 'all') return this.userList;
    if (this.filterCriteria === 'active') return this.userList.filter(u => u.isActive);
    if (this.filterCriteria === 'inactive') return this.userList.filter(u => !u.isActive);
    if (this.filterCriteria === 'managers') return this.userList.filter(u => u.role === 'hotel manager');
    return this.userList;
  }


 //  Update user status
 updateUserStatus(user: any, combinedValue: string) {
   let updateData: any = {};
   
   
   if (combinedValue === 'inactive') {
     updateData = { isActive: false };
   } else {
     updateData = { 
       isActive: true, 
       role: combinedValue.toLowerCase() 
     };
   }

   const targetId = user._id || user.id; 

   this.userService.updateUserById(targetId, updateData).subscribe({
     next: (res) => {
       console.log('User updated successfully');
       this.loadUsers(); // Refresh the table
     },
     error: (err) => {
       console.error('Update Error:', err);
       alert(`Failed to update user: ${err.error?.message || 'Server Error'}`);
     }
   });
 }

  // Open the Modal
  confirmDelete(user: any) {
    this.userToDelete = user;
    this.showDeleteModal = true;
  }

  //  Delete user 
  deleteUser() {
    if (this.userToDelete) {
      const targetId = (this.userToDelete as any)._id || this.userToDelete.id;

      this.userService.deleteUser(targetId).subscribe({
        next: (res) => {
          this.loadUsers(); 
          this.showDeleteModal = false;
          this.userToDelete = null;
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Server connection error';
          alert('Delete failed: ' + errorMsg);
          this.showDeleteModal = false;
        }
      });
    }
  }

  onFilterChange() {
    this.counter = 0;
  }
}