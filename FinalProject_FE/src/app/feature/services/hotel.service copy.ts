
import { Injectable } from '@angular/core';
import { Hotel, Room } from '../../shared/model/data.interface';
import { Hotels } from '../../shared/data/data';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class HotelService {
  private hotels: Hotel[] = Hotels;
  private apiUrl = 'http://localhost:3000/api/hotel';

  constructor(private http: HttpClient) { }

  getHotels(): Observable<Hotel[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => Array.isArray(res) ? res : (res?.data ?? []))
    );
  }

  getHotelById(id: string | null): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }

  getHotelsByManagerId(id: string): Observable<Hotel[]> {
    return this.getHotels().pipe(
      map((hotels: any) =>
        (Array.isArray(hotels) ? hotels : []).filter(h => h.managerId === id)
      )
    );
  }

  /** Change status of a specific room */
  onStatusChange(hotelId: string, roomId: string, status: string): Observable<any> {
    const body = {
      rooms: [{ roomId, status }]
    };
    return this.http.patch(`${this.apiUrl}/updateHotel/${hotelId}`, body);
  }

  deleteRoom(hotelId: string, roomId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteRoom/${hotelId}/${roomId}`);
  }

  createHotel(payload: any): Observable<Hotel> {

    return this.http.post<Hotel>(this.apiUrl, payload);
  }

  partialUpdateHotel(id: string, payload: any): Observable<Hotel> {

    return this.http.patch<Hotel>(`${this.apiUrl}/updateHotel/${id}`, payload);
  }

  saveHotelUpdate(hotelId: string, patch: Partial<Hotel>): Observable<any> {
    return this.http.patch(`${this.apiUrl}/updateHotel/${hotelId}`, patch);
  }

  saveRoom(hotelId: string, room: Room): Observable<any> {
    const body = { rooms: [room] };
    return this.saveHotelUpdate(hotelId, body);
  }

  updateRoomUnavailableDates(hotelId: string, roomId: string, dates: string[]) {
    const body = { rooms: [{ roomId, unavailableDates: dates }] };
    return this.http.patch(`${this.apiUrl}/updateHotel/${hotelId}`, body);
  }

}