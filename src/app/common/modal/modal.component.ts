import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-modal',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'] // Note: Corrected styleUrl to styleUrls
})
export class ModalComponent {
  @Input() modalTitle: string = '';
  @Input() modalContent: string = '';
  @Input() modalForm: boolean = false;
  @Input() modalFormFields: Array<any> = [];
  @Input() confirmAction: Function = () => {};

  closeModal() {
    // Close modal logic if you want to use jQuery
    $('#modal').modal('hide');
  }
}
