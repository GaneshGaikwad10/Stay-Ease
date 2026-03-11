  
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Room, Hotel } from '../../shared/model/data.interface';
import { HotelService } from '../../feature/services/hotel.service copy';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-room-form',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './room-form.html',
  styleUrls: ['./room-form.css'],
})
export class RoomForm implements OnInit {
  formData: Room = {
    roomId: '',
    type: '',
    price: 0,
    capacityAdults: 0,
    capacityChildren: 0,
    status: '',
    features: ['', ''],
    unavailableDates: []
  };

  hotel!: Hotel;
  isEdit: boolean = false;
  showMsg: boolean = false;

  constructor(
    public hotelSvc: HotelService,
    public router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    //  Get the Hotel ID from the URL
    this.route.paramMap.subscribe(params => {
      const hotelId = params.get('hotelId');
      const roomId = params.get('roomId');

      if (!hotelId) {
        this.router.navigate(['/overview']);
        return;
      }

      this.loadData(hotelId, roomId);
    });
  }

 
  loadData(hotelId: string, roomId: string | null) {
    this.hotelSvc.getHotelById(hotelId).subscribe({
      next: (foundHotel:Hotel) => {
        if (!foundHotel) {
          this.router.navigate(['/overview']);
          return;
        }
        this.hotel = foundHotel;

        //  Once hotel is loaded, check if we are editing a room
        if (roomId) {
          this.isEdit = true;
          const foundRoom = this.hotel.rooms.find(r => r.roomId === roomId);
          if (foundRoom) {
            this.formData = { ...foundRoom };
          } else {
            this.router.navigate(['/overview']);
          }
        }
      },
      error: (err:any) => {
        console.error('Error loading hotel data', err);
        this.router.navigate(['/overview']);
      }
    });
  }

onSubmit() {
  const hotelId = this.hotel.hotelId;

  
  if (!this.isEdit && !this.formData.roomId) {
    this.formData.roomId = 'r-' + Date.now();
  }

 
  this.hotelSvc.saveRoom(hotelId, this.formData).subscribe({
    next: (response:Room) => {
      this.showMsg = true;
      setTimeout(() => {
        this.showMsg = false;
        this.router.navigate(['manager-dashboard', hotelId, 'rooms']);
      }, 2000);
    },
    error: (err: any) => {
      console.error('Operation failed', err);
      alert('Could not save the room. Check if the Hotel ID exists in the DB.');
    }
  });
}

  onCancel() {
    if (confirm('Discard changes to this room?')) {
      this.router.navigate(['manager-dashboard', this.hotel.hotelId, 'rooms']);
    }
  }
}

