import { Component, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../api.service';
import { LoadingService } from '../../../loading.service';
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-itinerary-listing',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './itinerary-listing.component.html',
  styleUrl: './itinerary-listing.component.css'
})
export class ItineraryListingComponent {

page = 1; 
lastPage = 0;
totalQueries = 0;
userId :any;
userType :any;
userRole :any;
itineraries: any[] = [];
destinationList: any[] = [];
filterData = { type: '', start_date: '', end_date: '', note: '', name: '', destination: '' };

  constructor(
    private apiservice: ApiService,
    private LoadingService: LoadingService,
    private viewportScroller: ViewportScroller,
  ){
      this.userType = localStorage.getItem('user_type');
      this.userRole = localStorage.getItem('user_role');
      this.userId = localStorage.getItem('user_id');
      this.getItineraryDestinations();
      this.getItineraries();
  }


  @ViewChild('type') type!: ElementRef;
  @ViewChild('name') name!: ElementRef;
  @ViewChild('destination') destination!: ElementRef;
  @ViewChild('note') note!: ElementRef;
  @ViewChild('start_date') start_date!: ElementRef;
  @ViewChild('end_date') end_date!: ElementRef;



  private getItineraries(){
    this.LoadingService.show();
    let type;
    if(this.userRole != 1 && this.userRole != 2){
      type = this.userType;
    }
    this.apiservice.getItineraries(this.page, this.filterData).subscribe({
      next: (response) => {
        this.itineraries = response.itineraries.data;
        this.lastPage = response.itineraries.last_page;
        this.totalQueries = response.itineraries.total;
        this.viewportScroller.scrollToPosition([0, 0]);
        this.LoadingService.hide();
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
  }

  private getItineraryDestinations(){
    this.LoadingService.show();
    this.apiservice.getItineraryDestinations().subscribe({
      next: (response) => {
        this.destinationList = response.destinations;
        this.LoadingService.hide();
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
  }

  protected removeFilters(){

    this.name.nativeElement.value = '';
    this.type.nativeElement.value = '';
    this.destination.nativeElement.value = '';
    this.note.nativeElement.value = '';
    this.start_date.nativeElement.value = '';
    this.end_date.nativeElement.value = '';


    this.filterData = {
      type: '',
      start_date: '',
      end_date: '',
      destination: '',
      note: '',
      name: '',
    };
    this.getItineraries();
  }

  protected updateFilterData(title:string, value:string){
    if(title == 'type'){
      this.filterData.type = value;
    }
    if(title == 'start_date'){
      this.filterData.start_date = value;
    }
    if(title == 'end_date'){
      this.filterData.end_date = value;
    }
    if(title == 'destination'){
      this.filterData.destination = value;
    }
    if(title == 'note'){
      this.filterData.note = value;
    }
    if(title == 'name'){
      this.filterData.name = value;
    }
    this.page=1;
    this.getItineraries(); 
  }

  protected pageChange(offset: number | string){
    if(offset == '+' && this.page < this.lastPage){

      this.page++;
      this.getItineraries();
    }
    if(offset == '-' && this.page > 1){

      this.page--;
      this.getItineraries();
    }
    if(Number.isInteger(Number(offset))){

      this.page = Number(offset)
      this.getItineraries();
    }
  }

  dateFormat(oldDate:string): string {
    const date = new Date(oldDate);
    return date instanceof Date && !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-GB') 
      : '';  // Returns empty string if date is invalid
  }
  
}
