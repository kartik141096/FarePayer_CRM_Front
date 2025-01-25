import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { ToastService } from '../../../toast.service';
import { Router } from '@angular/router';

interface Destination {
  id: number;
  name: string;
  type:string;
}

interface Itinerary { 
  name: string; 
  startDate: string; 
  endDate: string; 
  type: string; 
  destination: Destination[];  
  adult_count: string; 
  child_count: string; 
  infant_count: string; note: string; 
}

@Component({
  selector: 'app-add-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-itinerary.component.html',
  styleUrls: ['./add-itinerary.component.css']
})

export class AddItineraryComponent {

  searchTerm: string = '';
  filteredCities: Destination[] = [];
  selectedDestinations: Destination[] = [];

  itinerary:Itinerary = { name: '', startDate: '', endDate: '', type: '', destination: [],  adult_count: '0', child_count: '0', infant_count: '0', note: '' };

  constructor(
    private apiservice: ApiService,
    private toastservice: ToastService,
    private router: Router,
  ){}

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

    const cityExists = this.itinerary.destination?.some(destination => destination.id === city.id);
  
    if (!cityExists) {
      if (!this.itinerary.destination) {
        this.itinerary.destination = [];
      }
      this.itinerary.destination.push({ id: city.id, name: city.name, type: city.type });
      this.searchTerm = '';
    } else {
      this.toastservice.showToast(city.name + " already selected");
    }
    this.filteredCities = [];
  }
  
  deleteDestinationById(id: number): void {
    this.itinerary.destination = this.itinerary.destination.filter(destination => destination.id !== id);
  }
  
  onSubmit(){
    this.apiservice.addItinerary(this.itinerary).subscribe({
      next: (response) => {
        this.toastservice.showToast(response.message);
        this.router.navigate([`/itinerary-listing`]);
      },
      error: (error) => {
        console.error('Failed to update user', error);
        this.toastservice.showToast(error.error.message);
      }
    });
  }
}
