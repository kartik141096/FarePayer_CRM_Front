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

  message: string = '';
  show = false;

  constructor(private toastService: ToastService) {}


  ngOnInit(): void {
    this.toastService.getToast().subscribe((message: string) => {
      this.message = message;
      this.show = true;
      this.autoHideToast();
    });
  }

  private autoHideToast(): void {
    setTimeout(() => {
      this.show = false;
    }, 3000); // Duration to show the toast
  }

  hideToast(): void {
    this.show = false;
  }
}
