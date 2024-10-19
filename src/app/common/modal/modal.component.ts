import { Component, Input } from '@angular/core';
// import * as $ from 'jquery';
declare var $: any;
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'] // Note: Corrected styleUrl to styleUrls
})
export class ModalComponent {
  @Input() modalTitle: string = '';
  @Input() modalContent: string = '';
  @Input() modalFooter: string = ''; 

  closeModal() {
    // Close modal logic if you want to use jQuery
    $('#modal').modal('hide');
  }
}
