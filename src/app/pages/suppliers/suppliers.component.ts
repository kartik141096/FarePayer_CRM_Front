
import { CommonModule, ViewportScroller } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingService } from '../../loading.service';
import { ApiService } from '../../api.service';
import { ModalComponent } from '../../common/modal/modal.component';
import { ToastService } from '../../toast.service';
import { RouterModule } from '@angular/router';
declare var $: any;

interface supplier{
  id: number,
  company: string,
  name: string,
  email: string,
  mobile: string,
  destination_id: number,
  destination_name: string,
  destination_type: string,
}


@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormsModule, RouterModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})
export class SuppliersComponent {

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  page = 1;
  deleteId = 0;
  lastPage = 0;
  addSupplierData = { company:'', name:'', email:'', mobile:'', destination_id:0, destination_type:''};
  filteredDestinations: any[] = [];
  searchTerm: string = '';
  modalTitle = '';
  modalContent = '';
  modalForm = false;
  totalsuppliers = 0;
  modalFormFields: Array<any> = [];
  suppliers:supplier []=[];

  constructor(
    private loadingService: LoadingService,
    private viewportScroller: ViewportScroller,
    private apiservice: ApiService,
    private toastService: ToastService,
  ){
    this.getAllSuppliers();
  }

  private getAllSuppliers(){

    this.loadingService.show();
    this.apiservice.getAllSuppliers(this.page).subscribe({
      next: (response) => {
        this.suppliers = response.data;
        this.lastPage = response.last_page;
        this.totalsuppliers = response.total;
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
      this.getAllSuppliers();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getAllSuppliers();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getAllSuppliers();
    }
  }

  protected deleteConfirm(id:number){
    this.deleteId = id;
    this.modalTitle = 'Delete Supplier';
    this.modalContent = 'Are you sure you want to delete this supplier.';
    this.modalComponent.confirmAction = this.deleteSupplier.bind(this);
    $('#modal').modal('show');
  }

  protected deleteSupplier(){
    this.apiservice.deleteSupplier(this.deleteId).subscribe({
      next: (response) => {
        $('#modal').modal('hide');
        this.loadingService.hide();
        this.getAllSuppliers();
        this.toastService.showToast(response.message)
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
        this.toastService.showToast("Unknown Error !!");
      }
    });
  }

  protected addSupplierDetails() {

    this.addSupplierData = { company:'', name:'', email:'', mobile:'', destination_id:0, destination_type:''};
    $('#addSupplierModal').modal('show');
  }

  protected closeSupplierModal() {
    $('#addSupplierModal').modal('hide');
  }

  protected addSupplier(){
    this.loadingService.show();
    this.apiservice.addSupplier(this.addSupplierData).subscribe({
      next: (response) => {
        $('#addSupplierModal').modal('hide');
        this.loadingService.hide();
        this.getAllSuppliers();
        this.toastService.showToast(response.message)
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        // $('#addSupplierModal').modal('hide');
        this.loadingService.hide();
        this.toastService.showToast("An Error Occured !!")
      }
    });
    // this.addRoomTypeName = '';
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
    this.addSupplierData.destination_id = destination.id;
    this.addSupplierData.destination_type = destination.type;
    this.searchTerm = destination.name;
    this.filteredDestinations = [];
  }

}
