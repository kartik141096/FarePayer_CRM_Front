import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModalComponent } from '../../../common/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../../loading.service';
import { ApiService } from '../../../api.service';
import { ToastService } from '../../../toast.service';
declare var $: any;

interface activityPrice{
  id: number,
  activity_master_id: number,
  from_date: string,
  to_date: string,
  adult_price:number,
  child_price:number,
}

@Component({
  selector: 'app-activities-price',
  standalone: true,
  imports: [RouterLink, CommonModule, ModalComponent, FormsModule],
  templateUrl: './activities-price.component.html',
  styleUrl: './activities-price.component.css'
})
export class ActivitiesPriceComponent {

  deleteId = 0;
  activityMasterID = 0;
  page = 1;
  lastPage = 0;
  totalActivityPriceList = 0;
  modalTitle = "";
  modalContent = "";
  activityPriceList: activityPrice [] = [];
  activityPrice = {activity_master_id: 0,from_date: '',to_date: '', adult_price:0, child_price:0}

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private loadingService: LoadingService,
    private apiservice: ApiService,
    private toastService: ToastService,
    private route:ActivatedRoute,
  ){
    this.activityMasterID = +this.route.snapshot.paramMap.get('id')!;
    this.getActivityPriceList();
  }

  dateFormat(oldDate:string): string {
    const date = new Date(oldDate);

    return date instanceof Date && !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-GB') 
      : '';

  }

  confirmDelete(id:number){
    this.deleteId = id;
    this.modalTitle = 'Delete Activity Price';
    this.modalContent = 'Are you sure you want to delete this activity Price.';
    this.modalComponent.confirmAction = this.deleteActivityPrice.bind(this);
    $('#modal').modal('show');
  }

  deleteActivityPrice(){
    this.apiservice.deleteActivityPrice(this.deleteId).subscribe({
      next: (response) => {
        this.getActivityPriceList();
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

  pageChange(offset: number | string){
    if(offset == '+' && this.page < this.lastPage){

      this.page++;
      this.getActivityPriceList();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getActivityPriceList();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getActivityPriceList();
    }
  }

  addPriceModal(){
    this.activityPrice = {activity_master_id: this.activityMasterID, from_date: '', to_date: '', adult_price:0, child_price:0}
    $('#activityModal').modal('show');
  }

  addActivityPrice(){
    this.loadingService.show();
    this.apiservice.addActivityPrice(this.activityPrice).subscribe({
      next: (response) => {
        this.closeModal();
        this.toastService.showToast(response.message)
        this.loadingService.hide();
        this.getActivityPriceList();
      },
      error: (error) => {
        // this.closeHotelModal();
        this.toastService.showToast(error.error.message)
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
      }
    });
  }

  getActivityPriceList(){
    this.loadingService.show();
    this.apiservice.getActivityPriceList(this.activityMasterID,this.page).subscribe({
      next: (response) => {
        this.activityPriceList = response.data;
        this.lastPage = response.last_page;
        this.totalActivityPriceList = response.total;
        this.closeModal();
        this.loadingService.hide();
      },
      error: (error) => {
        this.toastService.showToast(error.error.message)
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
      }
    });
  }

  closeModal() {
    $('#activityModal').modal('hide');
  }
}
