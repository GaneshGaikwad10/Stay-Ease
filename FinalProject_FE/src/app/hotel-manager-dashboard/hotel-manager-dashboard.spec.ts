import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelManagerDashboard } from './hotel-manager-dashboard';

describe('HotelManagerDashboard', () => {
  let component: HotelManagerDashboard;
  let fixture: ComponentFixture<HotelManagerDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelManagerDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelManagerDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
