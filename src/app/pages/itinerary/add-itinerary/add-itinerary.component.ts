import { Component } from '@angular/core';
import { ModalComponent } from '../../../common/modal/modal.component';
declare var $: any;
@Component({
  selector: 'app-add-itinerary',
  standalone: true,
  imports: [ModalComponent], // Import modal component here
  templateUrl: './add-itinerary.component.html',
  styleUrls: ['./add-itinerary.component.css']
})
export class AddItineraryComponent {
  modalTitle: string = '';
  modalContent: string = '';

  openModal(event: any) {
    const selectedValue = event.target.value;

    if (selectedValue === '1') {
      this.modalTitle = 'Option 1 Selected';
      this.modalContent = 'You selected Option 1!';
    } else if (selectedValue === '2') {
      this.modalTitle = 'Option 2 Selected';
      this.modalContent = 'You selected Option 2!';
    } else if (selectedValue === '3') {
      this.modalTitle = 'Option 3 Selected';
      this.modalContent = 'You selected Option 3!';
    } else if (selectedValue === '4') {
      this.modalTitle = 'Option 4 Selected';
      this.modalContent = 'You selected Option 4!';
    } else if (selectedValue === '5') {
      this.modalTitle = 'Option 5 Selected';
      this.modalContent = 'You selected Option 5!';
    } else if (selectedValue === '6') {
      this.modalTitle = 'Option 6 Selected';
      this.modalContent = 'You selected Option 6!';
    } else if (selectedValue === '7') {
      this.modalTitle = 'Option 7 Selected';
      this.modalContent = 'You selected Option 7!';
    } else if (selectedValue === '8') {
      this.modalTitle = 'Option 8 Selected';
      this.modalContent = 'You selected Option 8!';
    } else {
      // Default case if needed
      this.modalTitle = 'No Option Selected';
      this.modalContent = 'Please select an option.';
    }

    console.log("Opening modal with title:", this.modalTitle);
    // Use jQuery to open modal
    $('#modal').modal('show');
  }
}
