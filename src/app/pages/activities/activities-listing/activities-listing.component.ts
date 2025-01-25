import { CommonModule, ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ModalComponent } from '../../../common/modal/modal.component';
import { LoadingService } from '../../../loading.service';
import { ApiService } from '../../../api.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../toast.service';
declare var $: any;

interface activity{
id:number;
name:string;
img:string;
destination_id:string;
destination_name:string;
destination_type:string;
details:string;
status:boolean;
}

@Component({
  selector: 'app-activities-listing',
  standalone: true,
  imports: [RouterLink, CommonModule, ModalComponent, FormsModule],
  templateUrl: './activities-listing.component.html',
  styleUrl: './activities-listing.component.css'
})

export class ActivitiesListingComponent {

  page = 1;
  lastPage = 1;
  totalActivities = 0;
  searchTerm = '';
  deleteId = 0;
  updateStatus = 0;
  modalTitle = "";
  modalContent = "";
  modalSubmitText = "";
  selectedFile: File | null = null;
  activities :activity []=[];
  filteredDestinations: any[] = [];
  activity = { id:0, name:'', destination_id:'', destination_type:'', details:'', img:''}

  constructor(
    private loadingService: LoadingService,
    private apiservice: ApiService,
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ){
    this.getAllActivities();
  }

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  pageChange(offset: number | string){
    if(offset == '+' && this.page < this.lastPage){

      this.page++;
      this.getAllActivities();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getAllActivities();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getAllActivities();
    }
  }

  onSearchChange(): void {
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

  selectCity(destination: any): void {
    this.activity.destination_id = destination.id;
    this.activity.destination_type = destination.type;
    this.searchTerm = destination.name;
    this.filteredDestinations = [];
  }

  setDefaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/custom/default_img.png';
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.activity.img = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  closeModal() {
    $('#Modal').modal('hide');
  }

  addactivityDetails(){
    this.activity = { id:0, name:'',destination_id:'', destination_type:'', details:'', img:''}
    this.searchTerm = '';
    this.updateStatus = 0;
    this.modalTitle = "Add New Activity";
    this.modalSubmitText = "Add";
    $('#Modal').modal('show');
  }

  getAllActivities(){
    this.loadingService.show();
    this.apiservice.getAllActivities(this.page).subscribe({
      next: (response) => {
        this.activities = response.data;
        this.lastPage = response.last_page;
        this.totalActivities = response.total;
        this.viewportScroller.scrollToPosition([0, 0]);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
      }
    });
  }
  
  changeActivityStatus(id:number){

    const activity = this.activities.find(activity => activity.id === id);
    if (activity) {

      this.apiservice.changeActivityStatus(id,!activity.status).subscribe({
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
      activity.status = !activity.status; // Toggle the status
    }
  }

  confirmDeleteHotel(id:number){
    this.deleteId = id;
    this.modalTitle = 'Delete Activity';
    this.modalContent = 'Are you sure you want to delete this activity.';
    this.modalComponent.confirmAction = this.deleteActivity.bind(this);
    $('#modal').modal('show');
  }

  editActivityDetails(id:number){
    this.updateStatus = 1;
    const activity = this.activities.find(activity => activity.id === id);
    if(activity){
      this.activity = activity;
      this.loadingService.show();
      this.modalTitle = "Edit Activity Details";
      this.modalSubmitText = "Update";
      console.log(this.activity);
      $('#Modal').modal('show');
      this.apiservice.findDestinationName(this.activity.destination_id, this.activity.destination_type).subscribe({
        next: (response) => {
          this.searchTerm = response.destination_name;
          this.loadingService.hide();
        },
        error: (error) => {
          this.loadingService.hide();
          $('#Modal').modal('hide');
          this.toastService.showToast("Error Occured !");
          console.error('Error searching cities:', error);
        },
      });
    }else{
      this.toastService.showToast("Activity Not Found")
    }
  }

  deleteActivity(){
    this.apiservice.deleteActivity(this.deleteId).subscribe({
      next: (response) => {
        this.getAllActivities();
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

  addOrUpdateactivity(){

    this.loadingService.show();
    const formData = new FormData();
    formData.append('id', this.activity.id.toString());
    formData.append('name', this.activity.name);
    formData.append('destination_id', this.activity.destination_id);
    formData.append('destination_type', this.activity.destination_type);
    formData.append('details', this.activity.details);
    
    if (this.selectedFile) {
      formData.append('img', this.selectedFile, this.selectedFile.name);
    }

    if (this.updateStatus === 0) {
      this.apiservice.addActivity((formData as any)).subscribe({
        next: (response) => {
          this.closeModal();
          this.toastService.showToast(response.message);
          this.loadingService.hide();
          this.getAllActivities();
        },
        error: (error) => {
          this.toastService.showToast(error.error.message);
          console.error('An Error Occurred:', error);
          this.loadingService.hide();
        }
      });
    } 
    
    else if (this.updateStatus === 1) {
      this.apiservice.updateActivity(formData).subscribe({
        next: (response) => {
          this.closeModal();
          this.toastService.showToast(response.message);
          this.loadingService.hide();
          this.getAllActivities();
        },
        error: (error) => {
          this.toastService.showToast(error.error.message);
          console.error('An Error Occurred:', error);
          this.loadingService.hide();
        }
      });
    }
  }

  
}
