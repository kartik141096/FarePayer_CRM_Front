import { Component, ElementRef, ViewChild } from '@angular/core';
import { LoadingService } from '../../../loading.service';
import { ApiService } from '../../../api.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-listing',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './user-listing.component.html',
  styleUrl: './user-listing.component.css'
})

export class UserListingComponent {

  @ViewChild('id') search_by_id!: ElementRef;
  @ViewChild('search_by_name_email_mobile') search_by_name_email_mobile!: ElementRef;
  @ViewChild('role') role!: ElementRef;
  @ViewChild('type') type!: ElementRef;
  @ViewChild('created_from') created_from!: ElementRef;
  @ViewChild('created_to') created_to!: ElementRef;

  page = 1;
  lastPage = 0;
  users: any[] = [];
  selectedRoleId: number | null = null;
  userRole = localStorage.getItem('user_role');
  roles: { id: number, role_name: string, img: string }[] = [];
  filterData = { id: "", search_by_name_email_mobile: "", role: "", type: "", created_from: "", created_to: ""};

  constructor(
    private loadingService: LoadingService,
    private apiservice: ApiService,
    private viewportScroller: ViewportScroller,
  ){
    this.getUsersList();
    this.getUserRolesList();
  }

  protected pageChange(offset: number | string){
    if(offset == '+' && this.page < this.lastPage){

      this.page++;
      this.getUsersList();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getUsersList();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getUsersList();
    }
  }

  protected removeFilters(){

    // this.id.nativeElement.value = '';
    this.search_by_name_email_mobile.nativeElement.value = '';
    this.role.nativeElement.value = '';
    this.type.nativeElement.value = '';
    this.created_from.nativeElement.value = '';
    this.created_to.nativeElement.value = '';

    this.filterData = {
      id: '',
      search_by_name_email_mobile: '',
      role: '',
      type: '',
      created_from: '',
      created_to: '',
    };
    
    this.getUsersList();
  }
  
  protected updateFilterData(title:string, value:string){
    if(title == 'id'){
      this.filterData.id = value;
    }
    if(title == 'search_by_name_email_mobile'){
      this.filterData.search_by_name_email_mobile = value;
    }
    if(title == 'role'){
      this.filterData.role = value;
    }
    if(title == 'type'){
      this.filterData.type = value;
    }
    if(title == 'created_from'){
      this.filterData.created_from = value;
    }
    if(title == 'created_to'){
      this.filterData.created_to = value;
    }
    this.page=1;
    this.getUsersList(); 
  }

  private getUsersList(){
    this.loadingService.show();
    this.apiservice.getUserList(String(this.page), this.filterData).subscribe({
      next: (response) => {
        this.users = response.data;
        this.lastPage = response.last_page;
        this.viewportScroller.scrollToPosition([0, 0]);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
      }
    });
  }

  private getUserRolesList(){
    this.loadingService.show();
    this.apiservice.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data
        if (this.roles && this.roles.length > 0) {
          this.selectedRoleId = 0;
        }
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Failed to fetch user details', error)
        this.loadingService.hide();
      }
    });
  }
  
}
