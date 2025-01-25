import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../../common/modal/modal.component';
import { LoadingService } from '../../loading.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../toast.service';
import { RouterModule } from '@angular/router';
declare var $: any;

interface roomType{
  id: number,
  name: string,
  status: boolean,
}

@Component({
  selector: 'app-meal-plan',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, RouterModule],
  templateUrl: './meal-plan.component.html',
  styleUrl: './meal-plan.component.css'
})
export class MealPlanComponent {

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  page = 1;
  deleteId = 0;
  lastPage = 0;
  addMealPlanName = '';
  modalTitle = '';
  modalContent = '';
  modalForm = false;
  totalMealPlan = 0;
  room_types:roomType []=[];

  constructor(
    private loadingService: LoadingService,
    private viewportScroller: ViewportScroller,
    private apiservice: ApiService,
    private toastService: ToastService,
  ){
    this.getMealPlan();
  }

  private getMealPlan(){
    this.loadingService.show();
    this.apiservice.getMealPlan(this.page).subscribe({
      next: (response) => {
        this.room_types = response.data;
        this.lastPage = response.last_page;
        this.totalMealPlan = response.total;
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
      this.getMealPlan();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getMealPlan();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getMealPlan();
    }
  }

  protected deleteConfirm(id:number){
    this.deleteId = id;
    this.modalTitle = 'Delete Meal Plan';
    this.modalContent = 'Are you sure you want to delete this Meal Plan.';
    this.modalComponent.confirmAction = this.deleteMealPlan.bind(this);
    $('#modal').modal('show');
  }

  protected changeMealPlanStatus(id:number){

    const mealPlan = this.room_types.find(room => room.id === id);
    if (mealPlan) {

      this.apiservice.changeMealPlanStatus(id,!mealPlan.status).subscribe({
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
      mealPlan.status = !mealPlan.status; // Toggle the status
    }
  }

  protected deleteMealPlan(){
    this.apiservice.deleteMealPlan(this.deleteId).subscribe({
      next: (response) => {
        $('#modal').modal('hide');
        this.loadingService.hide();
        this.getMealPlan();
        this.toastService.showToast(response.message)
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
        this.toastService.showToast("Unknown Error !!");
      }
    });
  }

  protected addMealPlanDetails() {
    this.addMealPlanName = '';
    $('#addMealPlanModal').modal('show');
  }

  protected closeAddMealPlanModal() {
    $('#addMealPlanModal').modal('hide');
  }
  
  protected addMealPlan(){
    this.loadingService.show();
    this.apiservice.addMealPlan(this.addMealPlanName).subscribe({
      next: (response) => {
        $('#addMealPlanModal').modal('hide');
        this.loadingService.hide();
        this.getMealPlan();
        this.toastService.showToast(response.message)
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        $('#addMealPlanModal').modal('hide');
        this.loadingService.hide();
        this.toastService.showToast("An Error Occured !!")
      }
    });
    this.addMealPlanName = '';
  }

}
