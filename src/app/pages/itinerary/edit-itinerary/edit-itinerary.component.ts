import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../../api.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../loading.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../common/modal/modal.component';
declare var $: any;

interface Destination {
  id: number;
  name: string;
}

interface Itinerary { 
  name: string; 
  startDate: string; 
  endDate: string; 
  type: string; 
  duration: string;
  destinations: Destination[];
  daysCount:number;  
  adult_count: string; 
  child_count: string; 
  infant_count: string; note: string; 
}

@Component({
  selector: 'app-edit-itinerary',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './edit-itinerary.component.html',
  styleUrl: './edit-itinerary.component.css'
})

export class EditItineraryComponent {

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  
  itineraryId: number;
  days: number[] = [];
  activeDay = 1;
  modalContent = '';
  modalTitle = '';
  itinerary: Itinerary = { name: '', startDate: '', endDate: '', type: '', daysCount: 0, duration: '', destinations: [],  adult_count: '0', child_count: '0', infant_count: '0', note: '' };


  constructor(
    private apiservice: ApiService,
    private route: ActivatedRoute,
    private LoadingService: LoadingService,
  ){
    this.itineraryId = +this.route.snapshot.paramMap.get('id')!;
    this.getItineraryDetails();
  }


  getItineraryDetails(){
    this.apiservice.getItineraryDetails(this.itineraryId).subscribe({
      next: (response) => {
        this.itinerary = response;
        this.days = this.populateDays(this.itinerary.daysCount);
        this.LoadingService.hide();
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
  }

  changeActiveDay(day:number){
    this.activeDay = day;
  }
  
  populateDays(daysCount: number): number[] {
    return Array.from({ length: daysCount }, (_, i) => i + 1);
  }
  
  dateFormat(oldDate:string): string {
    const date = new Date(oldDate);
    return date instanceof Date && !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-GB') 
      : '';  // Returns empty string if date is invalid
  }

  addHotelDetails(id: number){
    this.modalTitle = 'Accomodation on Day'+this.activeDay;
    this.modalContent = '<input type="text" class="form-control">';
    this.modalComponent.confirmAction = this.addHotel.bind(this);
    $('#modal').modal('show');
  }

  addHotel(){}

}
