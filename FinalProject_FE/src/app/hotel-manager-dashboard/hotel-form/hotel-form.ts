



import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Hotel } from '../../shared/model/data.interface';
import { HotelService } from '../../feature/services/hotel.service copy';
import { UserService } from '../../feature/services/user.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-hotel-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-form.html',
  styleUrls: ['./hotel-form.css']
})
export class HotelForm implements OnInit {

  hotelsList: Hotel[] = [];
  hotelFormMode: 'add' | 'update' = 'add';
  showHotelForm: boolean = false;
  selectHotelIdForEdit: string = '';

  selectedFile: File | null = null;

  formData: any = {
    name: '',
    location: '',
    address: '',
    description: '',
    grade: null,
    image: '',
    amenities: [],
    rooms: []
  };

  amenityOptions = ['WiFi', 'Pool', 'Gym', 'Spa', 'Parking', 'Restaurant'];
  showMsg = false;
  message = '';

  constructor(
    public hotelSvc: HotelService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.loadHotels();


    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.hotelFormMode = 'update';
        this.showHotelForm = true;
        this.loadHotelData(id);
      }
    });
  }

  loadHotels() {
    const managerId = this.userService.getLoggedUserId();
    this.hotelSvc.getHotelsByManagerId(managerId).subscribe(list => {
      this.hotelsList = list;
    });
  }

  switchMode(mode: 'add' | 'update') {
    this.hotelFormMode = mode;
    if (mode === 'add') {
      this.showHotelForm = true;
      this.resetForm();
    } else {
      this.showHotelForm = false; 
    }
  }

  onSelectHotel(id: string) {
    this.selectHotelIdForEdit = id;
    if (id) {
      this.showHotelForm = true;
      this.loadHotelData(id);
    }
  }

  loadHotelData(id: string) {
    this.hotelSvc.getHotelById(id).subscribe(hotel => {
      this.formData = { ...hotel };
    });
  }

  toggleAmenity(amenity: string, isChecked: any) {
    if (!this.formData.amenities) this.formData.amenities = [];
    if (isChecked) {
      this.formData.amenities.push(amenity);
    } else {
      this.formData.amenities = this.formData.amenities.filter((a: string) => a !== amenity);
    }
  }

  
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }



  onSubmit() {
    const managerId = this.userService.getLoggedUserId();

    if (this.hotelFormMode === 'update') {
      const hotelId = this.formData.hotelId;
      const payload = {
        ...this.formData,
        managerId,
        amenities: Array.isArray(this.formData.amenities) ? this.formData.amenities : [],
        rooms: Array.isArray(this.formData.rooms) ? this.formData.rooms : []
        
      };

      this.hotelSvc.partialUpdateHotel(hotelId, payload).subscribe({
        next: () => this.handleSuccess('Hotel updated!'),
        error: (err) => console.error('Update failed', err)
      });

    } else {
      const hotelId = 'h-' + uuidv4();
      const fd = new FormData();
      fd.append('hotelId', hotelId);
      fd.append('name', this.formData.name);
      fd.append('location', this.formData.location);
      fd.append('address', this.formData.address);
      fd.append('managerId', managerId);
      fd.append('description', this.formData.description || '');
      fd.append('grade', this.formData.grade ? this.formData.grade.toString() : '');
      fd.append('amenities', JSON.stringify(this.formData.amenities || []));
      fd.append('rooms', JSON.stringify(this.formData.rooms || []));
      if (this.selectedFile) fd.append('image', this.selectedFile);

      this.hotelSvc.createHotel(fd).subscribe({
        next: () => this.handleSuccess('Hotel created!'),
        error: (err) => console.error('Create failed', err)
      });
    }
  }






  private handleSuccess(msg: string) {
    this.message = msg;
    this.showMsg = true;
    this.loadHotels()

    setTimeout(() => {
      this.showMsg = false;
      this.router.navigate(['manager-dashboard/overview']);
    }, 2000);
  }

  resetForm() {
    this.formData = { name: '', location: '', address: '', amenities: [], rooms: [], grade: null };
  }


 
}

