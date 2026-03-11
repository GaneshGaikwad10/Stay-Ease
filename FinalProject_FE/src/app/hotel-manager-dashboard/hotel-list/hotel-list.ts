

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

  // Aggregates
  totalRoomsAll = 0;
  totalAvailableAll = 0;
  totalOccupiedAll = 0;
  averageRatingAll = 0;

  searchText: string = '';

  constructor(
    public hotelSvc: HotelService,
    public router: Router,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadManagerHotels();
  }

  loadManagerHotels(): void {
    const managerId = this.userService.getLoggedUserId();
    if (!managerId) return;

    this.hotelSvc.getHotelsByManagerId(managerId).subscribe({
      next: (data) => {
        this._allHotels = data || [];
        console.log('all hotel list ',this._allHotels);
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
      return this.hotels;

    return this.hotels.filter(h =>
      h.name.toLowerCase().includes(text) ||
      h.location.toLowerCase().includes(text)
    );
  }

 
  private computeAggregates(): void {
    const list = this.hotels;

    let roomSum = 0;
    let availableSum = 0;
    let occupiedSum = 0;
    let ratingSum = 0;
    let ratingCount = 0;

    for (const h of list) {
      roomSum += this.totalRooms(h);
      availableSum += this.countAvailable(h);
      occupiedSum += this.countOccupied(h);

      if (h.rating) {
        ratingSum += h.rating;
        ratingCount++;
      }
    }

    this.totalRoomsAll = roomSum;
    this.totalAvailableAll = availableSum;
    this.totalOccupiedAll = occupiedSum;
    this.averageRatingAll =
      ratingCount > 0 ? ratingSum / ratingCount : 0;
  }

  totalRooms(h: Hotel): number {
    return h.rooms?.length || 0;
  }

  countAvailable(h: Hotel): number {
    return h.rooms?.filter(r => r.status === 'Available').length || 0;
  }

  countOccupied(h: Hotel): number {
    return h.rooms?.filter(r => r.status === 'Occupied').length || 0;
  }

  select(h: Hotel): void {
    this.router.navigate(['manager-dashboard', h.hotelId, 'rooms']);
  }
}

