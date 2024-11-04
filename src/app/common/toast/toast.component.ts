import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ToastComponent implements OnInit {
  messages: string[] = [];
  show = false;
  timeout: any;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.getToast().subscribe((message: string) => {
      this.messages.push(message);
      if (!this.show) {
        this.displayNextToast();
      }
    });
  }

  private displayNextToast(): void {
    if (this.messages.length === 0) {
      this.show = false;
      return;
    }
    this.show = true;
    const message = this.messages.shift(); // Get the next message
    // Display the message for a fixed duration
    setTimeout(() => {
      this.show = false;
      this.displayNextToast(); // Show the next message
    }, 3000); // Duration to show the toast
  }
}
