import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../api.service';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../loading.service';

@Component({
  selector: 'app-query-listing',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './query-listing.component.html',
  styleUrl: './query-listing.component.css'
})

export class QueryListingComponent {

  constructor(private apiservice: ApiService, private router:Router, private authService:AuthService, private loadingService: LoadingService){}
  
  ngOnInit(): void {
    this.getQueries();    
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

  queries: any[] = [];
  page = 1;
  lastPage = 0;

  filterData = {
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

  protected removeFilters(){

    this.createdFrom.nativeElement.value = '';
    this.createdTo.nativeElement.value = '';
    this.updatedFrom.nativeElement.value = '';
    this.updatedTo.nativeElement.value = '';
    this.searchById.nativeElement.value = '';
    this.status.nativeElement.value = '';
    this.searchByNameEmailMobile.nativeElement.value = '';
    this.destination.nativeElement.value = '';
    this.assignedTo.nativeElement.value = '';
    this.source.nativeElement.value = '';

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
    if(offset == '+'){

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

  private getQueries(){
    this.loadingService.show();
    this.apiservice.getQueries(String(this.page), this.filterData).subscribe({
      next: (response) => {
        this.queries = response.data;
        this.lastPage = response.last_page;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('An Error Occured : ', error);
        this.loadingService.hide();
        if(error.error.message == 'Unauthenticated.')
          this.authService.logout();
      }
    });
  }

}
