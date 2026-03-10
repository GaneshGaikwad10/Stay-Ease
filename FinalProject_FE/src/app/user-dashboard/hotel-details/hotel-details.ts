import { Component } from '@angular/core';
import { HotelService } from '../../feature/services/hotel.service copy';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchCriteriaService } from '../../feature/services/search.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectedRoomsService } from '../../feature/services/rooms.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-hotel-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-details.html',
  styleUrl: './hotel-details.css',
})
export class HotelDetails {
  hotelId!: string;
  userId!: string | null;
  hotel: any;
  roomList: any[] = [];

  selectedRooms: any[] = [];

  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private searchCriteriaService: SearchCriteriaService,
    private selectedRoomsService: SelectedRoomsService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    
    this.route.paramMap.subscribe(params => {
      const hotelId = params.get('hotelId');
      if (hotelId) {
        this.hotelId = hotelId;
        this.loadHotelDetails(hotelId);
      }
    });
  }

  private loadHotelDetails(hotelId: string) {
    this.hotelService.getHotelById(hotelId).subscribe({
      next: (res) => {
        this.hotel = res;
        this.filterRooms(); 
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load hotel', err);
      }
    });
  }

  private filterRooms() {
    if (!this.hotel) return;

    const criteria = this.searchCriteriaService.getCriteria();

    if (criteria) {
      const checkInDate = new Date(criteria.checkIn);
      const checkOutDate = new Date(criteria.checkOut);

      this.roomList = this.hotel.rooms
        .filter((room: any) => {
          if (room.status !== 'Available') return false;
          if (criteria.adults > room.capacityAdults || criteria.children > room.capacityChildren) {
            return false;
          }
          const isUnavailable = room.unavailableDates.some((date: string) => {
            const cleanDateStr = date.split('_')[0];
            const d = new Date(cleanDateStr);

            // Check if this date falls within the booking range
            return d >= checkInDate && d <= checkOutDate;
          });
          return !isUnavailable;
        })
        .map((r: any) => ({ ...r, quantity: 0 }));
    } else {
      this.roomList = this.hotel.rooms
        .filter((room: any) => room.status === 'Available')
        .map((r: any) => ({ ...r, quantity: 0 }));
    }
  }


  get totalPrice(): number {
    return this.roomList.reduce((sum, room) => sum + (room.price * room.quantity), 0);
  }

  increase(roomId: string) {
    const room = this.roomList.find(r => r.roomId === roomId);
    if (room) room.quantity++;
  }

  decrease(roomId: string) {
    const room = this.roomList.find(r => r.roomId === roomId);
    if (room && room.quantity > 0) room.quantity--;
  }

  reserveRooms() {
    this.selectedRooms = this.roomList.filter(r => r.quantity > 0);

    if (this.selectedRooms.length > 0) {
      this.selectedRoomsService.setSelectedRooms(this.selectedRooms);
      this.router.navigate(['user-dashboard/payment', this.hotelId]);
    }
    else {
      alert("Please select at least 1 room...");
    }
  }


  backFunc() {
    window.history.back();
  }
}




