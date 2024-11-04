import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../api.service';
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-add-query',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-query.component.html',
  styleUrl: './add-query.component.css'
})
export class AddQueryComponent {

  constructor(private apiservice: ApiService, private toastService:ToastService){}

  addQuery = {
    mobile: '',
    email: '',
    title: '',
    name: '',
    destination: '',
    from_date: '',
    to_date: '',
    adult_count: '',
    child_count: '',
    infant_count: '',
    source: '',
    priority: '',
    assign_to: '',
    remarks: '',
  };

  onSubmit(): void {
    this.apiservice.addQuery(this.addQuery).subscribe({
      next: (response) => {
        this.toastService.showToast("Query successfully added.");
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
