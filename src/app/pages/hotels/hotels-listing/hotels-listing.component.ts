import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { LoadingService } from '../../../loading.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ApiService } from '../../../api.service';
import { ToastService } from '../../../toast.service';
import { ModalComponent } from '../../../common/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
declare var $: any;

interface hotel{
  id:number
  name:string,
  category:string,
  destination_id:string,
  destination_name:string,
  destination_type:string,
  details:string,
  contact_person:string,
  email:string,
  status:boolean,
  phone:string,
  img:string,
  website:string,
}

@Component({
  selector: 'app-hotels-listing',
  standalone: true,
  imports: [FormsModule, CommonModule, ModalComponent, RouterModule],
  templateUrl: './hotels-listing.component.html',
  styleUrl: './hotels-listing.component.css'
})
export class HotelsListingComponent {

  page = 1;
  lastPage = 0;
  deleteId = 0;
  totalHotels = 0;
  updateStatus = 0;
  hotels:hotel []=[];
  modalSubmitText: string = "";
  searchTerm: string = '';
  modalTitle: string = '';
  modalContent: string = '';
  selectedFile: File | null = null;
  filteredDestinations: any[] = [];
  hotel = { id:0, name:'', category:'', destination_id:'', destination_type:'', destination_name:'', details:'', contact_person:'', email:'', phone:'', img:'', website:'test.com'}

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private loadingService: LoadingService,
    private viewportScroller: ViewportScroller,
    private apiservice: ApiService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ){
    this.getAllHotels();
  }

  protected pageChange(offset: number | string){
    if(offset == '+' && this.page < this.lastPage){

      this.page++;
      this.getAllHotels();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getAllHotels();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getAllHotels();
    }
  }

  private getAllHotels(){
    this.loadingService.show();
    this.apiservice.getAllHotels(this.page).subscribe({
      next: (response) => {
        this.hotels = response.data;
        this.lastPage = response.last_page;
        this.totalHotels = response.total;
        this.viewportScroller.scrollToPosition([0, 0]);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
      }
    });
  }

  protected changeHotelStatus(id:number){

    const hotel = this.hotels.find(hotel => hotel.id === id);
    if (hotel) {

      this.apiservice.changeHotelStatus(id,!hotel.status).subscribe({
        next: (response) => {
          $('#modal').modal('hide');
          this.loadingService.hide();
        },
        error: (error) => {
          console.error('An Error Occured : ', error);
          this.loadingService.hide();
          this.toastService.showToast("Unknown Error !!");
        }
      });
      hotel.status = !hotel.status; // Toggle the status
    }
  }

  // protected addOrUpdatehotel(){
  //   this.loadingService.show();
  //   if(this.updateStatus == 0){

  //     this.apiservice.addhotel(this.hotel).subscribe({
  //       next: (response) => {
  //         this.closeHotelModal();
  //         this.toastService.showToast(response.message)
  //         this.loadingService.hide();
  //         this.getAllHotels();
  //       },
  //       error: (error) => {
  //         // this.closeHotelModal();
  //         this.toastService.showToast(error.error.message)
  //         console.error('An Error Occured : ', error);
  //         this.loadingService.hide();
  //       }
  //     });
  //   }else if(this.updateStatus == 1){

  //     this.apiservice.updateHotel(this.hotel).subscribe({
  //       next: (response) => {
  //         this.closeHotelModal();
  //         this.toastService.showToast(response.message)
  //         this.loadingService.hide();
  //         this.getAllHotels();
  //       },
  //       error: (error) => {
  //         // this.closeHotelModal();
  //         this.toastService.showToast(error.error.message)
  //         console.error('An Error Occured : ', error);
  //         this.loadingService.hide();
  //       }
  //     });
  //   }
  // }

  protected addOrUpdatehotel() {
    
    this.loadingService.show();
    const formData = new FormData();
    formData.append('id', this.hotel.id.toString());
    formData.append('name', this.hotel.name);
    formData.append('category', this.hotel.category);
    formData.append('destination_id', this.hotel.destination_id);
    formData.append('destination_type', this.hotel.destination_type);
    formData.append('details', this.hotel.details);
    formData.append('contact_person', this.hotel.contact_person);
    formData.append('email', this.hotel.email);
    formData.append('phone', this.hotel.phone);
    formData.append('website', this.hotel.website);
    
    if (this.selectedFile) {
      formData.append('img', this.selectedFile, this.selectedFile.name);
    }

    if (this.updateStatus === 0) {
      this.apiservice.addhotel((formData as any)).subscribe({
        next: (response) => {
          this.closeHotelModal();
          this.toastService.showToast(response.message);
          this.loadingService.hide();
          this.getAllHotels();
        },
        error: (error) => {
          this.toastService.showToast(error.error.message);
          console.error('An Error Occurred:', error);
          this.loadingService.hide();
        }
      });
    } 
    
    else if (this.updateStatus === 1) {
      this.apiservice.updateHotel(formData).subscribe({
        next: (response) => {
          this.closeHotelModal();
          this.toastService.showToast(response.message);
          this.loadingService.hide();
          this.getAllHotels();
        },
        error: (error) => {
          this.toastService.showToast(error.error.message);
          console.error('An Error Occurred:', error);
          this.loadingService.hide();
        }
      });
    }
  }
  
  protected addHotelDetails() {
    this.hotel = {
      id:0,
      name:'',
      category:'',
      destination_id:'',
      destination_type:'',
      destination_name:'',
      details:'',
      contact_person:'',
      email:'',
      phone:'',
      img:'',
      website:'',
    }
    this.searchTerm = '';
    this.updateStatus = 0;
    this.modalTitle = "Add New Hotel";
    this.modalSubmitText = "Add";
    $('#addHotelModal').modal('show');
  }

  protected onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.hotel.img = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
  
  protected closeHotelModal() {
    $('#addHotelModal').modal('hide');
  }

  protected getStarCount(category: string | null): number | null {
    if (!category) return null; // Handle null or undefined values
  
    const normalizedCategory = category.trim().toLowerCase();
  
    const starMatch = normalizedCategory.match(/^(\d+)-star$/);
    return starMatch ? parseInt(starMatch[1], 10) : null;
  }
  
  protected onSearchChange(): void {
    if (this.searchTerm) {
      this.filteredDestinations = [];
      this.apiservice.searchCities(this.searchTerm).subscribe({
        next: (response) => {
          this.filteredDestinations = response;
        },
        error: (error) => {
          console.error('Error searching cities:', error);
        },
      });
    } else {
      this.filteredDestinations = [];
    }
  }

  protected selectCity(destination: any): void {
    this.hotel.destination_id = destination.id;
    this.hotel.destination_type = destination.type;
    this.searchTerm = destination.name;
    this.filteredDestinations = [];
  }

  protected editHotelDetails(id:number){
    this.updateStatus = 1;
    const hotel = this.hotels.find(hotel => hotel.id === id);
    if(hotel){
      this.hotel = hotel;
      this.loadingService.show();
      this.modalTitle = "Edit Hotel Details";
      this.modalSubmitText = "Update";
      $('#addHotelModal').modal('show');
      this.apiservice.findDestinationName(this.hotel.destination_id, this.hotel.destination_type).subscribe({
        next: (response) => {
          this.searchTerm = response.destination_name;
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          $('#addHotelModal').modal('hide');
          this.toastService.showToast("Error Occured !");
          console.error('Error searching cities:', error);
        },
      });
    }else{
      this.toastService.showToast("Hotel Not Found")
    }
  }

  protected confirmDeleteHotel(id:number){
    this.deleteId = id;
    this.modalTitle = 'Delete Hotel';
    this.modalContent = 'Are you sure you want to delete this hotel.';
    this.modalComponent.confirmAction = this.deleteHotel.bind(this);
    $('#modal').modal('show');
  }
  
  protected deleteHotel(){
    this.apiservice.deleteHotel(this.deleteId).subscribe({
      next: (response) => {
        this.getAllHotels();
        $('#modal').modal('hide');
        this.toastService.showToast(response.message);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        $('#modal').modal('hide');
        this.loadingService.hide();
        this.toastService.showToast(error.error.error);
      }
    });
  }
  
  protected setDefaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/custom/default_img.png';
  }
}
