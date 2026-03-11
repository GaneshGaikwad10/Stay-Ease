


import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Hotel, Room } from '../../shared/model/data.interface';
import { HotelService } from '../../feature/services/hotel.service copy';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-room-management',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './room-management.html',
  styleUrls: ['./room-management.css'],
})
export class RoomManagement implements OnInit {
  hotel: Hotel | undefined; 
  hotelNotFoundMsg = '';
  isLoading = false; 

  constructor(
    public hotelSvc: HotelService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const hotelId = params.get('hotelId');
      if (!hotelId) {
        this.router.navigate(['manager-dashboard/overview']);
        return;
      }
      this.loadHotel(hotelId);
    });
  }

  
  loadHotel(hotelId: string) {
    this.isLoading = true;
    this.hotelSvc.getHotelById(hotelId).subscribe({
      next: (h:Hotel) => {
        this.hotel = h;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.noHotelFound();
      }
    });
  }

  

  onBack() {
    this.router.navigate(['manager-dashboard/overview']);
  }

  onAddRoom() {
    if (!this.hotel) return;
    this.router.navigate(['manager-dashboard', this.hotel.hotelId, 'rooms', 'add']);
  }

  onEditRoom(r: Room) {
    if (!this.hotel) return;
    this.router.navigate(['manager-dashboard', this.hotel.hotelId, 'rooms', r.roomId, 'edit']);
  }

  
  onStatusChanged(r: Room) {
    if (!this.hotel) return;

    const msg = `Are you sure you want to change the status of Room ${r.roomId}?`;
    if (!confirm(msg)) return;

    this.hotelSvc.onStatusChange(this.hotel.hotelId, r.roomId, r.status).subscribe({
      next: () => {
        console.log('Status updated successfully in DB');
        
      },
      error: (err: any) => {
        console.error('Status update failed', err);
        alert('Failed to update status on the server.');
        this.loadHotel(this.hotel!.hotelId);
      }
    });
  }

 
  onDeleteRoom(r: Room) {
  if (!this.hotel) return;

  if (!confirm('Are you sure you want to delete this room?')) return;

  this.hotelSvc.deleteRoom(this.hotel.hotelId, r.roomId).subscribe({
    next: () => {
      
      const updatedRooms = this.hotel?.rooms?.filter(room => room.roomId !== r.roomId);
      
      if (this.hotel && updatedRooms) {
        this.hotel.rooms = updatedRooms;
      }
      
      console.log('Room deleted from DB and UI');
    },
    error: (err: any) => {
      console.error('Room delete failed', err);
      alert('Could not delete room. Please try again.');
    }
  });
}
  noHotelFound() {
    this.hotelNotFoundMsg = 'Hotel not found. Redirecting to overview dashboard...';
    setTimeout(() => {
      this.router.navigate(['manager-dashboard/overview']);
    }, 3000);
  }
}

