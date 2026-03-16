import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Room, Hotel } from '../../shared/model/data.interface';
import { HotelService } from '../../feature/services/hotel.service copy';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-room-form',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './room-form.html',
  styleUrls: ['./room-form.css'],
})
export class RoomForm implements OnInit {
 
 
featureList = ['Mountain View', 'King Bed', 'Sea View', 'Queen Bed', 'Balcony', 'Work Desk'];
 
  formData: Room = {
    roomId: '',
    type: '',
    price: 0,
    capacityAdults: 0,
    capacityChildren: 0,
    status: 'Available',
    features: [],
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
      console.log(hotelId)
 
      if (!hotelId) {
        this.router.navigate(['/overview']);
        return;
      }
 
      this.loadData(hotelId, roomId);
    });
  }
 
 
 
 
  loadData(hotelId: string, roomId: string | null) {
  this.hotelSvc.getHotelById(hotelId).subscribe({
    next: (foundHotel: Hotel) => {
      this.hotel = foundHotel;
 
      if (roomId) {
        this.isEdit = true;
        const foundRoom = this.hotel.rooms.find(r => r.roomId === roomId);
        if (foundRoom) {
          // Keep existing status; if somehow missing, fallback to 'Available'
          this.formData = {
            ...foundRoom,
            features: Array.isArray(foundRoom.features) ? foundRoom.features : [],
            status: foundRoom.status || 'Available'
          };
        } else {
          this.router.navigate(['/overview']);
        }
      } else {
        // Add mode → status already 'Available'
        this.isEdit = false;
      }
    },
    error: () => this.router.navigate(['/overview'])
  });
}
 
 
 
 
  toggleFeature(feature: string, isChecked: boolean) {
  if (!this.formData.features) {
    this.formData.features = [];
  }
 
  if (isChecked) {
    // Add feature if checked and not already in the list
    if (!this.formData.features.includes(feature)) {
      this.formData.features.push(feature);
    }
  } else {
    // Remove feature if unchecked
    this.formData.features = this.formData.features.filter(f => f !== feature);
  }
}
 
 
onSubmit(form: any) {
  if (form.pristine) return; // no changes → no alert, no API call
 
  const hotelId = this.hotel.hotelId;
 
  if (!this.isEdit) {
    this.formData.roomId = 'r-' + uuidv4().split('-')[0];
    // extra safety: ensure status set
    if (!this.formData.status) this.formData.status = 'Available';
  }
 
  // In Edit mode, do NOT overwrite status (field is hidden)
 
  this.hotelSvc.saveRoom(hotelId, this.formData).subscribe({
    next: () => {
      this.showMsg = true;
      setTimeout(() => {
        this.showMsg = false;
        this.router.navigate(['manager-dashboard', hotelId, 'rooms']);
      }, 1000);
    }
  });
}
 
 
  onCancel() {
    if (confirm('Discard changes to this room?')) {
      this.router.navigate(['manager-dashboard', this.hotel.hotelId, 'rooms']);
    }
  }
}
 
 
 