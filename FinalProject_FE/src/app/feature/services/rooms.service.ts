import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectedRoomsService {
  private selectedRooms: any[] = [];

 
  setSelectedRooms(rooms: any[]) {
    this.selectedRooms = rooms;
  }

  
  getSelectedRooms(): any[] {
    return this.selectedRooms;
  }
  
}
