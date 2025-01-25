import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../api.service';
import { AuthService } from '../../../auth.service';
import { CommonModule, ViewportScroller } from '@angular/common';
import { LoadingService } from '../../../loading.service';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
}

interface Query {
  id: number;
  title: string;
  name: string;
  mobile: string;
  email: string;
  destination: string;
  adult_count: number;
  child_count: number;
  infant_count: number;
  from_date: string;
  to_date: string;
  source: string;
  status: string;
  priority: string;
  assign_to: number;  // Assuming 'assign_to' is a user ID
  created_on: string;
  updated_on: string;
  assign_to_name?: string;  // Optionally, store the user name here
  assign_to_email?: string;  // Optionally, store the user name here
}


@Component({
  selector: 'app-query-listing',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './query-listing.component.html',
  styleUrl: './query-listing.component.css'
})

export class QueryListingComponent {

  page = 1;
  lastPage = 0;
  totalQueries = 0;
  users : User[]=[];
  queries: any[] = [];
  destinationList: any[] = [];
  userRole = localStorage.getItem('user_role');
  filterData = { created_from: '', created_to: '', updated_from: '', updated_to: '', search_by_id: '', status: '', search_by_name_email_mobile: '', destination: '', assigned_to: '', source: '', };

  constructor(
    private apiservice: ApiService,
    private authService:AuthService, 
    private loadingService: LoadingService,
    private viewportScroller: ViewportScroller,
  ){
    this.getQueries(); 
    this.getSalesUsers();
    this.getQueryDestinations();
  }

  @ViewChild('created_from') createdFrom!: ElementRef;
  @ViewChild('created_to') createdTo!: ElementRef;
  @ViewChild('updated_from') updatedFrom!: ElementRef;
  @ViewChild('updated_to') updatedTo!: ElementRef;
  @ViewChild('search_by_id') searchById!: ElementRef;
  @ViewChild('status') status!: ElementRef;
  @ViewChild('search_by_name_email_mobile') searchByNameEmailMobile!: ElementRef;
  @ViewChild('destination') destination!: ElementRef;
  @ViewChild('assigned_to') assignedTo!: ElementRef;
  @ViewChild('source') source!: ElementRef;

  protected removeFilters(){

    this.createdFrom.nativeElement.value = '';
    this.createdTo.nativeElement.value = '';
    this.updatedFrom.nativeElement.value = '';
    this.updatedTo.nativeElement.value = '';
    this.searchById.nativeElement.value = '';
    this.status.nativeElement.value = '';
    this.searchByNameEmailMobile.nativeElement.value = '';
    this.destination.nativeElement.value = '';
    if(this.userRole == '1' || this.userRole == '2'){

      this.assignedTo.nativeElement.value = '';
      this.source.nativeElement.value = '';
    }

    this.filterData = {
      created_from: '',
      created_to: '',
      updated_from: '',
      updated_to: '',
      search_by_id: '',
      status: '',
      search_by_name_email_mobile: '',
      destination: '',
      assigned_to: '',
      source: '',
    };
    this.getQueries();
  }

  protected updateFilterData(title:string, value:string){
    if(title == 'created_from'){
      this.filterData.created_from = value;
    }
    if(title == 'created_to'){
      this.filterData.created_to = value;
    }
    if(title == 'updated_from'){
      this.filterData.updated_from = value;
    }
    if(title == 'updated_to'){
      this.filterData.updated_to = value;
    }
    if(title == 'search_by_id'){
      this.filterData.search_by_id = value;
    }
    if(title == 'status'){
      this.filterData.status = value;
    }
    if(title == 'search_by_name_email_mobile'){
      this.filterData.search_by_name_email_mobile = value;
    }
    if(title == 'destination'){
      this.filterData.destination = value;
    }
    if(title == 'assigned_to'){
      this.filterData.assigned_to = value;
    }
    if(title == 'source'){
      this.filterData.source = value;
    }
    this.page=1;
    this.getQueries(); 
  }

  protected pageChange(offset: number | string){
    if(offset == '+' && this.page < this.lastPage){

      this.page++;
      this.getQueries();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getQueries();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getQueries();
    }
  }

  private getQueries() {
    this.loadingService.show();
    this.apiservice.getQueries(String(this.page), this.filterData).subscribe({
      next: (response) => {
        this.queries = response.data;
        this.lastPage = response.last_page;
        this.totalQueries = response.total;
        this.viewportScroller.scrollToPosition([0, 0]);
          this.loadingService.hide();
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
        if (error.error.message === 'Unauthenticated.') {
          this.authService.logout();
        }
      }
    });
  }
  
  private getQueryDestinations(){
    this.loadingService.show();
    this.apiservice.getQueryDestinations().subscribe({
      next: (response) => {
        this.destinationList = response;
        this.loadingService.hide();
      },
      error: (error) => {
        this.loadingService.hide();
      }
    });
  }

  private getSalesUsers(){
    this.loadingService.show();
    this.apiservice.getSalesUsers('all').subscribe({
      next: (response) => {
        this.users = response;
        this.loadingService.hide();

      },
      error: (error) => {
        this.loadingService.hide();
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
