import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { ToastService } from '../../../toast.service';
import { LoadingService } from '../../../loading.service';

interface DestinationResponse {
  id: number;
  name: string;
}
interface User {
  id: number;
  name: string;
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

  addQuery = {
    mobile: '',
    email: '',
    title: '',
    name: '',
    destination: 0,
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

  filteredCities: DestinationResponse[] = [];
  searchTerm: string = '';

  destinations: DestinationResponse[] = [];
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
  
  selectCity(city: DestinationResponse): void {
    this.addQuery.destination = city.id;
    this.searchTerm = city.name;
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
  



}
