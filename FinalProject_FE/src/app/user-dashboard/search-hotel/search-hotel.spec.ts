import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchHotel } from './search-hotel';

describe('SearchHotel', () => {
  let component: SearchHotel;
  let fixture: ComponentFixture<SearchHotel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchHotel]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHotel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Positive test: searchHotels filters correctly
  it('should filter hotels by destination', () => {
    component.hotels = [
      { hotelId: 'H1', location: 'Paris', rooms: [{ status: 'Available', capacityAdults: 2, capacityChildren: 1, price: 1000, unavailableDates: [] }] },
      { hotelId: 'H2', location: 'London', rooms: [{ status: 'Available', capacityAdults: 2, capacityChildren: 1, price: 1200, unavailableDates: [] }] }
    ];
    component.destination = 'Paris';
    component.checkIn = '2026-02-10';
    component.checkOut = '2026-02-12';
    component.adults = 2;
    component.children = 0;

    component.searchHotels();

    expect(component.filteredHotels.length).toBe(1);
    expect(component.filteredHotels[0].location).toBe('Paris');
  });

  //Negative test: searchHotels should clear results if fields missing
  it('should not search if required fields are missing', () => {
    component.hotels = [
      { hotelId: 'H1', location: 'Paris', rooms: [{ status: 'Available', capacityAdults: 2, capacityChildren: 1, price: 1000, unavailableDates: [] }] }
    ];
    component.destination = ''; // missing destination
    component.checkIn = '';
    component.checkOut = '';
    component.adults = null;
    component.children = null;

    component.searchHotels();

    expect(component.filteredHotels.length).toBe(0);
  });
});
