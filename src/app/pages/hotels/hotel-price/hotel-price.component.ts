import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../../../common/modal/modal.component';
import { LoadingService } from '../../../loading.service';
import { ApiService } from '../../../api.service';
import { ToastService } from '../../../toast.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare var $: any;

interface roomType{
  id:number,
  name:string
}
interface mealPlan{
  id:number,
  name:string
}
interface hotelPrice{
  id: number,
  hotel_master_id: number,
  from_date: string,
  to_date: string,
  room_type: {id:number,name:string},
  meal_plan: {id:number,name:string},
  single_price: number,
  double_price: number,
  triple_price: number,
  extra_bed: number,
  CWB_price: number,
  CNB_price: number
}

@Component({
  selector: 'app-hotel-price',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent],
  templateUrl: './hotel-price.component.html',
  styleUrl: './hotel-price.component.css'
})
export class HotelPriceComponent {

  page = 1;
  lastPage = 0;
  // updateStatus = 0;
  totalHotelsPriceList = 0
  roomTypes: roomType[] = [];
  mealPlans : mealPlan[] = [];
  deleteId = 0;
  modalTitle = '';
  modalContent = '';
  hotelPrice = {hotel_master_id: 0,from_date: '',to_date: '',room_type: 0,meal_plan: 0,single_price: 0,double_price: 0,triple_price: 0,extra_bed: 0,CWB_price: 0,CNB_price: 0,}
  hotel_master_id = 0;
  hotelPriceList: hotelPrice [] = [];
  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  constructor(
    private loadingService:LoadingService,
    private apiservice:ApiService,
    private toastService:ToastService,
    private route:ActivatedRoute,
  ){
    this.hotel_master_id = +this.route.snapshot.paramMap.get('id')!;
    this.getHotelPriceList();
    this.getRoomTypes();
    this.getMealPlan();
  }

  private getRoomTypes(){
    
    this.loadingService.show();
    this.apiservice.getRoomTypes(0).subscribe({
        next: (response) => {
          this.loadingService.hide();
          this.roomTypes = response;
        },
        error: (error) => {
          console.error('An Error Occured : ', error);
          this.loadingService.hide();
        }
      });
  }

  private getMealPlan(){
    
    this.loadingService.show();
    this.apiservice.getMealPlan(0).subscribe({
        next: (response) => {
          this.loadingService.hide();
          this.mealPlans = response;
        },
        error: (error) => {
          console.error('An Error Occured : ', error);
          this.loadingService.hide();
        }
      });
  }

  protected closeHotelPriceModal() {
    $('#addHotelPriceModal').modal('hide');
  }

  protected addHotelPriceModal(){
    // this.updateStatus = 0
    this.hotelPrice = {hotel_master_id: this.hotel_master_id,from_date: '',to_date: '',room_type: 0,meal_plan: 0,single_price: 0,double_price: 0,triple_price: 0,extra_bed: 0,CWB_price: 0,CNB_price: 0,}
    $('#addHotelPriceModal').modal('show');
  }

  protected getHotelPriceList(){
    this.apiservice.getHotelPriceList(this.hotel_master_id,this.page).subscribe({
      next: (response) => {
        this.hotelPriceList = response.data;
        this.lastPage = response.last_page;
        this.totalHotelsPriceList = response.total;
        this.closeHotelPriceModal();
        this.loadingService.hide();
      },
      error: (error) => {
        this.toastService.showToast(error.error.message)
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
      }
    });
  }

  protected pageChange(offset: number | string){
    if(offset == '+' && this.page < this.lastPage){

      this.page++;
      this.getHotelPriceList();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getHotelPriceList();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getHotelPriceList();
    }
  }

  protected addHotelPrice(){
    this.loadingService.show();
      this.apiservice.addHotelPrice(this.hotelPrice).subscribe({
        next: (response) => {
          this.closeHotelPriceModal();
          this.toastService.showToast(response.message)
          this.loadingService.hide();
          this.getHotelPriceList();
        },
        error: (error) => {
          // this.closeHotelModal();
          this.toastService.showToast(error.error.message)
          console.error('An Error Occured : ', error);
          this.loadingService.hide();
        }
      });
  }

  protected confirmDeleteHotel(id:number){
    this.deleteId = id;
    this.modalTitle = 'Delete Hotel Price';
    this.modalContent = 'Are you sure you want to delete this hotel Price.';
    this.modalComponent.confirmAction = this.deleteHotelPrice.bind(this);
    $('#modal').modal('show');
  }
  
  protected deleteHotelPrice(){
    this.apiservice.deleteHotelPrice(this.deleteId).subscribe({
      next: (response) => {
        this.getHotelPriceList();
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

  protected dateFormat(oldDate:string): string {
    const date = new Date(oldDate);

    return date instanceof Date && !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-GB') 
      : '';

  }

}
