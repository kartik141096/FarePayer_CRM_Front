import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../loading.service';
import { ApiService } from '../../api.service';
import { ModalComponent } from '../../common/modal/modal.component';
import { ToastService } from '../../toast.service';
import { RouterModule } from '@angular/router';
declare var $: any;

interface roomType{
  id: number,
  name: string,
  status: boolean,
}

@Component({
  selector: 'app-room-type',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, RouterModule],
  templateUrl: './room-type.component.html',
  styleUrl: './room-type.component.css'
})

export class RoomTypeComponent {

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  page = 1;
  deleteId = 0;
  lastPage = 0;
  addRoomTypeName = '';
  modalTitle = '';
  modalContent = '';
  modalForm = false;
  totalRoomTypes = 0;
  modalFormFields: Array<any> = [];
  room_types:roomType []=[];

  constructor(
    private loadingService: LoadingService,
    private viewportScroller: ViewportScroller,
    private apiservice: ApiService,
    private toastService: ToastService,
  ){
    this.getRoomTypes();
  }

  private getRoomTypes(){

    this.loadingService.show();
    this.apiservice.getRoomTypes(this.page).subscribe({
      next: (response) => {
        this.room_types = response.data;
        this.lastPage = response.last_page;
        this.totalRoomTypes = response.total;
        this.viewportScroller.scrollToPosition([0, 0]);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
      }
    });
  }

  protected pageChange(offset: number | string){
    if(offset == '+' && this.page < this.lastPage){

      this.page++;
      this.getRoomTypes();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getRoomTypes();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getRoomTypes();
    }
  }

  protected deleteConfirm(id:number){
    this.deleteId = id;
    this.modalTitle = 'Delete Room Type';
    this.modalContent = 'Are you sure you want to delete this room type.';
    this.modalComponent.confirmAction = this.deleteRoomType.bind(this);
    $('#modal').modal('show');
  }

  protected changeRoomTypeStatus(id:number){

    const roomType = this.room_types.find(room => room.id === id);
    if (roomType) {
      // console.log(!roomType.status); 

      this.apiservice.changeRoomTypeStatus(id,!roomType.status).subscribe({
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
      roomType.status = !roomType.status; // Toggle the status
    }


    
  }

  protected deleteRoomType(){
    this.apiservice.deleteRoomType(this.deleteId).subscribe({
      next: (response) => {
        $('#modal').modal('hide');
        this.loadingService.hide();
        this.getRoomTypes();
        this.toastService.showToast(response.message)
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
        this.toastService.showToast("Unknown Error !!");
      }
    });
  }

  protected addRoomTypeDetails() {
    this.addRoomTypeName = '';
    $('#addRoomTypeModal').modal('show');
  }

  protected closeAddRoomTypeModal() {
    $('#addRoomTypeModal').modal('hide');
  }
  
  protected addRoomType(){
    this.loadingService.show();
    this.apiservice.addRoomType(this.addRoomTypeName).subscribe({
      next: (response) => {
        $('#addRoomTypeModal').modal('hide');
        this.loadingService.hide();
        this.getRoomTypes();
        this.toastService.showToast(response.message)
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        $('#addRoomTypeModal').modal('hide');
        this.loadingService.hide();
        this.toastService.showToast("An Error Occured !!")
      }
    });
    this.addRoomTypeName = '';
  }

}
