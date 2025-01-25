import { CommonModule, ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../../toast.service';
import { LoadingService } from '../../../loading.service';
import { ModalComponent } from '../../../common/modal/modal.component';
declare var $: any;

interface transfer{
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
  selector: 'app-transfers-listing',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ModalComponent],
  templateUrl: './transfers-listing.component.html',
  styleUrl: './transfers-listing.component.css'
})
export class TransfersListingComponent {

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  page = 1;
  lastPage = 1;
  deleteId = 0;
  totaltransfers = 0;
  updateStatus = 0;
  searchTerm = '';
  modalTitle = '';
  // modalComponent = '';
  modalContent = '';
  modalSubmitText = '';
  selectedFile: File | null = null;
  filteredDestinations: any[] = [];
  transfer = { id:0, name:'', destination_id:'', destination_type:'', details:'', img:''}
  transfers :transfer []=[];

  constructor(
    private apiservice: ApiService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private viewportScroller: ViewportScroller,
  ){
    this.getAllTransfers();
  }

  
  addOrUpdateTransfer(){

    this.loadingService.show();
    const formData = new FormData();
    formData.append('id', this.transfer.id.toString());
    formData.append('name', this.transfer.name);
    formData.append('destination_id', this.transfer.destination_id);
    formData.append('destination_type', this.transfer.destination_type);
    formData.append('details', this.transfer.details);
    
    if (this.selectedFile) {
      formData.append('img', this.selectedFile, this.selectedFile.name);
    }

    if (this.updateStatus === 0) {
      this.apiservice.addTransfer((formData as any)).subscribe({
        next: (response) => {
          this.closeModal();
          this.toastService.showToast(response.message);
          this.loadingService.hide();
          this.getAllTransfers();
        },
        error: (error) => {
          this.toastService.showToast(error.error.message);
          console.error('An Error Occurred:', error);
          this.loadingService.hide();
        }
      });
    } 
    
    else if (this.updateStatus === 1) {
      this.apiservice.updateTransfer(formData).subscribe({
        next: (response) => {
          this.closeModal();
          this.toastService.showToast(response.message);
          this.loadingService.hide();
          this.getAllTransfers();
        },
        error: (error) => {
          this.toastService.showToast(error.error.message);
          console.error('An Error Occurred:', error);
          this.loadingService.hide();
        }
      });
    }
  }

  getAllTransfers(){
    
    this.loadingService.show();
    this.apiservice.getAllTransfers(this.page).subscribe({
      next: (response) => {
        this.transfers = response.data;
        this.lastPage = response.last_page;
        this.totaltransfers = response.total;
        this.viewportScroller.scrollToPosition([0, 0]);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
      }
    });
  }

  addtransfersDetails(){
    this.transfer = { id:0, name:'',destination_id:'', destination_type:'', details:'', img:''}
    this.searchTerm = '';
    this.updateStatus = 0;
    this.modalTitle = "Add New Transfers";
    this.modalSubmitText = "Add";
    $('#Modal').modal('show');
  }

  editTransferDetails(id:number){
    this.updateStatus = 1;
    const transfer = this.transfers.find(activity => activity.id === id);
    if(transfer){
      this.transfer = transfer;
      this.loadingService.show();
      this.modalTitle = "Edit Transfer Details";
      this.modalSubmitText = "Update";
      $('#Modal').modal('show');
      this.apiservice.findDestinationName(this.transfer.destination_id, this.transfer.destination_type).subscribe({
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
      this.toastService.showToast("Transfer Not Found")
    }
  }

  closeModal() {
    $('#Modal').modal('hide');
  }

  changeTransferStatus(id:number){

    const activity = this.transfers.find(activity => activity.id === id);
    if (activity) {

      this.apiservice.changeTransferStatus(id,!activity.status).subscribe({
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

  pageChange(offset: number | string){
    if(offset == '+' && this.page < this.lastPage){

      this.page++;
      this.getAllTransfers();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getAllTransfers();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getAllTransfers();
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
    this.transfer.destination_id = destination.id;
    this.transfer.destination_type = destination.type;
    this.searchTerm = destination.name;
    this.filteredDestinations = [];
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.transfer.img = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  setDefaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/custom/default_img.png';
  }

  confirmDeleteTransfer(id:number){
    this.deleteId = id;
    this.modalTitle = 'Delete Transfer';
    this.modalContent = 'Are you sure you want to delete this transfer.';
    this.modalComponent.confirmAction = this.deleteTransfer.bind(this);
    $('#modal').modal('show');
  }
  
  deleteTransfer(){
    this.loadingService.show();
    this.apiservice.deleteTransfer(this.deleteId).subscribe({
      next: (response) => {
        this.getAllTransfers();
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
}
