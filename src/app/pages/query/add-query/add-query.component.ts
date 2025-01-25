import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { ToastService } from '../../../toast.service';
import { LoadingService } from '../../../loading.service';

interface Destination {
  id: number;
  name: string;
  type: string;
}
interface User {
  id: number;
  name: string;
}

interface query {
  mobile: string,
  email: string,
  title: string,
  name: string,
  destinations: Destination[],
  from_date: string,
  to_date: string,
  adult_count: string,
  child_count: string,
  infant_count: string,
  source: string,
  priority: string,
  query_type: string,
  assign_to: string,
  remarks: string,
}

@Component({
  selector: 'app-add-query',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-query.component.html',
  styleUrl: './add-query.component.css'
})



export class AddQueryComponent {

  @ViewChild('destinationSelect') destinationSelect!: ElementRef;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2, 
    private apiservice: ApiService, 
    private toastService:ToastService, 
    private LoadingService:LoadingService, 
  ){}

  addQuery:query = {
    mobile: '',
    email: '',
    title: '',
    name: '',
    destinations: [],
    from_date: '',
    to_date: '',
    adult_count: '0',
    child_count: '0',
    infant_count: '0',
    source: '',
    priority: '',
    query_type: '',
    assign_to: 'un-assigned',
    remarks: '',
  };

  users : User[]=[];
  selectedDestinations: Destination[] = [];
  filteredCities: Destination[] = [];
  searchTerm: string = '';

  destinations: Destination[] = [];
  selectedDestinationId: number = 0;


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

    const cityExists = this.addQuery.destinations?.some(destination => destination.id === city.id);
    if (!cityExists) {
      if (!this.addQuery.destinations) {
        this.addQuery.destinations = [];
      }
      this.addQuery.destinations.push({ id: city.id, name: city.name, type:city.type });
      this.searchTerm = '';
    } else {
      this.toastService.showToast(city.name + " already selected");
    }
    this.filteredCities = [];
  }

  getSalesUsers(){
    this.LoadingService.show();
    this.apiservice.getSalesUsers(this.addQuery.query_type).subscribe({
      next: (response) => {
        this.users = response;
        this.LoadingService.hide();

      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
  }

  onSubmit(): void {

    this.apiservice.addQuery(this.addQuery).subscribe({
      next: (response) => {
        this.toastService.showToast(response.message);
      },
      error: (error) => {
        if (error.status === 422) {
          const errorMessages = error.error.errors;
          for (const key in errorMessages) {
            if (errorMessages.hasOwnProperty(key)) {
              const messages = errorMessages[key];
              messages.forEach((message: string) => {
                this.toastService.showToast(message);
              });
            }
          }
        } else {
          console.error('Query Addition failed:', error);
          this.toastService.showToast("An unexpected error occurred.");
        }
      }
    });
  }
  
  deleteDestinationById(id: number): void {
    this.addQuery.destinations = this.addQuery.destinations.filter(destination => destination.id !== id);
  }


}
