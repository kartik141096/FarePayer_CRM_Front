import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { ToastService } from '../../../toast.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingService } from '../../../loading.service';

interface Destination {
  id: number;
  name: string;
  type:string;
  destination_id:number;
}

interface Itinerary { 
  id:number;
  name: string; 
  start_date: string; 
  end_date: string; 
  type: string; 
  destination: Destination[];  
  newDestination: Destination[];  
  adult_count: string; 
  child_count: string; 
  infant_count: string; note: string; 
}

@Component({
  selector: 'app-edit-itinerary-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-itinerary-details.component.html',
  styleUrl: './edit-itinerary-details.component.css'
})

export class EditItineraryDetailsComponent {

  searchTerm: string = '';
  filteredCities: Destination[] = [];
  selectedDestinations: Destination[] = [];

  itinerary:Itinerary = { id:0, name: '', start_date: '', end_date: '', type: '', destination: [], newDestination:[],  adult_count: '0', child_count: '0', infant_count: '0', note: '' };

  constructor(
    private apiservice: ApiService,
    private toastservice: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
  ){
    this.itinerary.id = +this.route.snapshot.paramMap.get('id')!;
    this.getItineraryByID();
  }

  onSearchChange(): void {
    if (this.searchTerm) {
      this.filteredCities = [];
      this.apiservice.searchCities(this.searchTerm).subscribe({
        next: (response) => {
          this.filteredCities = response;
        },
        error: (error) => {
          console.error('Error searching cities:', error);
        },
      });
    } else {
      this.filteredCities = [];
    }
  }

  selectCity(city: Destination): void {

    const cityExists = this.itinerary.destination?.some(destination => destination.destination_id === city.id);
    const newCityExists = this.itinerary.newDestination?.some(destination => destination.id === city.id);
    
    if (!cityExists && !newCityExists) {
      if (!this.itinerary.newDestination) {
        this.itinerary.newDestination = [];
      }
      this.itinerary.newDestination.push({ id:0, destination_id: city.id, name: city.name, type: city.type });
      console.log(this.itinerary.destination)
      console.log(this.itinerary.newDestination)
      this.searchTerm = '';
    } else {
      this.toastservice.showToast(city.name + " already selected");
    }
    this.filteredCities = [];
  }
  
  deleteDestinationById(id: number): void {
    this.itinerary.destination = this.itinerary.destination.filter(destination => destination.id !== id);
  }

  getItineraryByID(){
    this.loadingService.show();
    this.apiservice.getItineraryByID(this.itinerary.id).subscribe({
      next: (response) => {
        this.itinerary = response;
        this.itinerary.start_date = this.dateFormat(response.start_date,2);
        this.itinerary.end_date = this.dateFormat(response.end_date,2);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Failed to update user', error);
        this.loadingService.hide();
        this.toastservice.showToast(error.error.message);
      }
    });
  }

  dateFormat(oldDate:string, type:number=1): string {
    const date = new Date(oldDate);

    if(type == 1){
      
      return date instanceof Date && !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-GB') 
      : '';

    }else{
      
      if (date instanceof Date && !isNaN(date.getTime())) {
        date.setDate(date.getDate() + 1);
        
        return date.toISOString().split('T')[0];
      } else {
        return '';
      }
    }
  }
  
  onSubmit(){
    this.apiservice.updateItinerary(this.itinerary).subscribe({
      next: (response) => {
        this.toastservice.showToast(response.message);
        this.router.navigate([`/edit-itinerary/`+this.itinerary.id]);
      },
      error: (error) => {
        console.error('Failed to update user', error);
        this.toastservice.showToast(error.error.message);
      }
    });
  }
}
