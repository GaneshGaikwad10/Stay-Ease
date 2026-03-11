

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Hotel, Room } from '../../shared/model/data.interface';
import { HotelService } from '../../feature/services/hotel.service copy';
import { UserService } from '../../feature/services/user.service';

@Component({
  selector: 'app-availability',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './availability.html',
  styleUrls: ['./availability.css'],
})
export class Availability implements OnInit {
  
  hotelsList: Hotel[] = [];
  selectedHotel: Hotel | null = null;
  selectedRoom: Room | null = null;

  // Calendar 
  viewDate: Date = new Date();
  today: Date = new Date();
  daysInMonth: number[] = [];
  selectedAction: 'Available' | 'Occupied' | 'Maintenance' | '' = '';

  constructor(
    public hotelSvc: HotelService,
    public userService: UserService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit() {
    this.generateDays();
    this.today = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

    // Fetch hotels for the manager
    const managerId = this.userService.getLoggedUserId();
    this.hotelSvc.getHotelsByManagerId(managerId).subscribe((list) => {
      this.hotelsList = list;
    });

   
    this.route.paramMap.subscribe((params) => {
      const hotelId = params.get('hotelId');
      const roomId = params.get('roomId');

      if (hotelId) {
        this.loadHotelData(hotelId, roomId);
      } else {
        this.selectedHotel = null;
        this.selectedRoom = null;
      }
    });
  }

  loadHotelData(hotelId: string, roomId: string | null) {
    this.hotelSvc.getHotelById(hotelId).subscribe((hotel) => {
      this.selectedHotel = hotel;
      if (roomId && hotel.rooms) {
        this.selectedRoom = hotel.rooms.find((r) => r.roomId === roomId) || null;
      } else {
        this.selectedRoom = null;
      }
    });
  }

  generateDays() {
    const y = this.viewDate.getFullYear();
    const m = this.viewDate.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: lastDay }, (_, i) => i + 1);
  }

  changeMonth(offset: number) {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + offset, 1);
    this.generateDays();
  }

  isPast(day: number): boolean {
    const check = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), day);
    return check < this.today;
  }

  private getDateStr(day: number): string {
    const y = this.viewDate.getFullYear();
    const m = (this.viewDate.getMonth() + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  getStatus(day: number): 'Past' | 'Available' | 'Occupied' | 'Maintenance' {
    if (this.isPast(day)) return 'Past';
    if (!this.selectedRoom) return 'Available';

    const date = this.getDateStr(day);
    const match = this.selectedRoom.unavailableDates.find((x) => x.startsWith(date));
    
    if (!match) return 'Available';
    return match.includes('MAINTENANCE') ? 'Maintenance' : 'Occupied';
  }
  

  toggleStatus(day: number) {
  if (!this.selectedRoom || !this.selectedHotel) return;
  if (this.isPast(day)) return;

  const dateStr = this.getDateStr(day); // "2023-01-01"
  
 
  let updatedDates = [...this.selectedRoom.unavailableDates];

  updatedDates = updatedDates.filter(entry => entry.split('_')[0] !== dateStr);

  
  if (this.selectedAction === 'Occupied') {
    updatedDates.push(dateStr); 
  } 
  else if (this.selectedAction === 'Maintenance') {
    updatedDates.push(`${dateStr}_MAINTENANCE`);
  }

  // Sending the entire updated array to the backend
  this.hotelSvc.updateRoomUnavailableDates(
    this.selectedHotel.hotelId, 
    this.selectedRoom.roomId, 
    updatedDates
  ).subscribe({
    next: () => {
      this.selectedRoom!.unavailableDates = updatedDates;
      console.log('Update Successful:', updatedDates);
    },
    error: (err) => alert('Failed to update: ' + err.message)
  });
}

  
  onHotelChange(hotelId: string) {
    this.router.navigate(['manager-dashboard/availability', hotelId || '']);
  }

  onRoomChange(roomId: string) {
    if (this.selectedHotel && roomId) {
      this.router.navigate(['manager-dashboard/availability', this.selectedHotel.hotelId, roomId]);
    }
  }
}

