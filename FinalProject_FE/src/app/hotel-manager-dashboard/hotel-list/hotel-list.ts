import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Hotel } from '../../shared/model/data.interface';
import { HotelService } from '../../feature/services/hotel.service copy';
import { UserService } from '../../feature/services/user.service';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-list.html',
  styleUrls: ['./hotel-list.css']
})
export class HotelList implements OnInit {

  private _allHotels: Hotel[] = [];
  today = new Date().toISOString().split("T")[0];

  // Aggregates
  totalRoomsAll = 0;
  totalAvailableToday = 0;
  totalOccupiedToday = 0;
  averageRatingAll = 0;

  searchText: string = '';

  constructor(
    public hotelSvc: HotelService,
    public router: Router,
    public userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadManagerHotels();
  }

  loadManagerHotels(): void {
    const managerId = this.userService.getLoggedUserId();
    if (!managerId) return;

    this.hotelSvc.getHotelsByManagerId(managerId).subscribe({
      next: (data) => {
        this._allHotels = data || [];
        console.log('all hotel list ', this._allHotels);
        this.computeAggregates();
      },
      error: (err) => console.error('Error loading hotels:', err)
    });
  }


  get hotels() {
    return this._allHotels;
  }


  get filteredHotels() {
    const text = this.searchText.toLowerCase().trim();

    if (!text)
      return this.hotels;//redirect to get hotels()

    return this.hotels.filter(h =>
      h.name.toLowerCase().includes(text) ||
      h.location.toLowerCase().includes(text)
    );
  }


  private computeAggregates(): void {
    const list = this.hotels;

    let roomSum = 0;

    let avail = 0;
    let occ = 0;


    let ratingSum = 0;
    let ratingCount = 0;

    for (const h of list) {
      roomSum += this.totalRooms(h);

      avail += this.countAvailableToday(h);
      occ += this.countOccupiedToday(h);



      if (h.rating) {
        ratingSum += h.rating;
        ratingCount++;
      }
    }

    this.totalRoomsAll = roomSum;
    this.totalAvailableToday = avail;
    this.totalOccupiedToday = occ;
    this.averageRatingAll = ratingCount> 0 ? ratingSum / ratingCount : 0;
  }

  totalRooms(h: Hotel): number {
    return h.rooms?.length || 0;
  }





  countAvailableToday(h: Hotel) {
    return h.rooms.filter(r => !r.unavailableDates.includes(this.today)).length;
  }

  countOccupiedToday(h: Hotel) {
    return h.rooms.filter(r => r.unavailableDates.includes(this.today)).length;
  }

  select(h: Hotel): void {
    this.router.navigate(['manager-dashboard', h.hotelId, 'rooms']);
  }
}