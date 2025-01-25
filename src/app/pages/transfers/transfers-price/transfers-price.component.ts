import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LoadingService } from '../../../loading.service';
import { ApiService } from '../../../api.service';
import { ToastService } from '../../../toast.service';
import { ModalComponent } from '../../../common/modal/modal.component';
declare var $: any;

interface transfer {
  id: number,
  transfers_master_id: number,
  from_date: string,
  to_date: string,
  type:string;
  adult_price:number,
  child_price:number,
  vehical_price:number,
}

@Component({
  selector: 'app-transfers-price',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, ModalComponent],
  templateUrl: './transfers-price.component.html',
  styleUrl: './transfers-price.component.css'
})
export class TransfersPriceComponent {

  page = 1;
  lastPage = 1;
  deleteId = 0;
  modalTitle = '';
  modalContent = '';
  totalTransfersPriceList = 0;
  TransferPrice = {transfers_master_id: 0, from_date: '', to_date: '', type:'', vehical_price:0, adult_price:0, child_price:0}
  transferMasterID = 0;
  transferPriceList: transfer [] = [];

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private loadingService: LoadingService,
    private apiservice: ApiService,
    private toastService: ToastService,
    private route:ActivatedRoute,
  ){
    this.transferMasterID = +this.route.snapshot.paramMap.get('id')!;
    this.getTransferPriceList();
  }

  addTransferPrice(){
    this.loadingService.show();
    this.apiservice.addTransferPrice(this.TransferPrice).subscribe({
      next: (response) => {
        this.closeModal();
        this.toastService.showToast(response.message)
        this.loadingService.hide();
        this.getTransferPriceList();
      },
      error: (error) => {
        // this.closeHotelModal();
        this.toastService.showToast(error.error.message)
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
      }
    });
  }

  getTransferPriceList(){
    this.loadingService.show();
    this.apiservice.getTransferPriceList(this.transferMasterID,this.page).subscribe({
      next: (response) => {
        this.transferPriceList = response.data;
        this.lastPage = response.last_page;
        this.totalTransfersPriceList = response.total;
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

  addPriceModal(){
    this.TransferPrice = {transfers_master_id: this.transferMasterID, from_date: '', to_date: '', type:'', vehical_price:0, adult_price:0, child_price:0}
    $('#activityModal').modal('show');
  }

  dateFormat(oldDate:string): string {
    const date = new Date(oldDate);

    return date instanceof Date && !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-GB') 
      : '';

  }

  closeModal() {
    $('#activityModal').modal('hide');
  }

  confirmDelete(id:number){
    this.deleteId = id;
    this.modalTitle = 'Delete Activity Price';
    this.modalContent = 'Are you sure you want to delete this activity Price.';
    this.modalComponent.confirmAction = this.deleteTransferPrice.bind(this);
    $('#modal').modal('show');
  }
  
  deleteTransferPrice(){
    this.loadingService.show();
    this.apiservice.deleteTransferPrice(this.deleteId).subscribe({
      next: (response) => {
        this.getTransferPriceList();
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
      this.getTransferPriceList();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getTransferPriceList();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getTransferPriceList();
    }
  }
}
