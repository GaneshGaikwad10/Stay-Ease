import { Component } from '@angular/core';
import { HotelService } from '../../feature/services/hotel.service copy';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchCriteriaService } from '../../feature/services/search.service';
import { Router } from '@angular/router';
import { UserService } from '../../feature/services/user.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-search-hotel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './search-hotel.html',
  styleUrls: ['./search-hotel.css'],
})
export class SearchHotel {
  hotels: any[] = [];
  userId!: string;

  //Search bar bindings
  destination: string = '';
  checkIn: string = '';
  checkOut: string = '';
  adults: number | null = null;
  children: number | null = null;
  todayString : string = '';

  filteredHotels: any[] = [];

  constructor(
    private hotelService: HotelService,
    private searchCriteria: SearchCriteriaService,
    private userService: UserService,
    private router: Router,
    private changeRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
  this.hotelService.getHotels().subscribe((res: any) => {
    this.hotels = res;
  });
  this.userId = this.userService.getLoggedUserId();

  const today = new Date(); 
  this.todayString = today.toISOString().split('T')[0];
}

  viewHotel(id: string) {
    const temp = {
      destination: this.destination,
      checkIn: this.checkIn,
      checkOut: this.checkOut,
      adults: this.adults,
      children: this.children,
    };
    this.searchCriteria.setCriteria(temp);
    this.router.navigate(['user-dashboard/hotel-details', id]);
  }

showNoResults = false;

searchHotels() {
    if (!this.destination || !this.checkIn || !this.checkOut || this.adults === null || this.children === null) {
      alert('Please fill all search fields before searching.');
      this.filteredHotels = [];
      this.showNoResults = true;
      return;
    }

    const criteria = {
      destination: this.destination.trim(),
      checkIn: new Date(this.checkIn).toISOString(),
      checkOut: new Date(this.checkOut).toISOString(),
      adults: Number(this.adults),
      children: Number(this.children),
    };

    this.searchCriteria.searchHotels(criteria).subscribe({
      next: (res: any[]) => {
        this.filteredHotels = res;
        console.log(this.filteredHotels);
        this.showNoResults = false;

        if (res.length === 0) {
          setTimeout(() => {
            this.showNoResults = true;
            this.changeRef.detectChanges();
          }, 2000);
        } else {
          this.changeRef.detectChanges();
        }
      },
      error: (err) => {
        console.error('Search failed', err);
        alert('Error searching hotels. Please try again.');
        this.showNoResults = true;
        this.changeRef.detectChanges();
      }
    });
  }



}
