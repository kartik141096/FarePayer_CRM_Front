import { Component, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../api.service';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../loading.service';
import { ToastService } from '../../../toast.service';
import { ModalComponent } from '../../../common/modal/modal.component';
declare var $: any;

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink, ModalComponent]
})

export class UserDetailsComponent {

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;

  userId:number;
  currentUserID = parseInt(localStorage.getItem('user_id') || '0', 10);
  roles: { id: number, role_name: string, img: string }[] = [];
  user = { id:0, name:'', email:'', mobile:'', user_type:'', role_id:0, img:'', type:'' }
  modalTitle: string = '';
  modalContent: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private router: Router,
  ) {
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.getUserDetailsPageData();
   }

   confirmDelete(){
    this.modalTitle = 'Delete User Account';
    this.modalContent = 'Are you sure you want to delete this account.';
    this.modalComponent.confirmAction = this.deleteUser.bind(this);
    $('#modal').modal('show');
   }

  deleteUser(){
    $('#modal').modal('hide');
    this.loadingService.show();
    this.apiService.deleteUser(this.userId).subscribe({
      next: (data) => {
        this.loadingService.hide();
        this.toastService.showToast(data.message);
        this.router.navigate(['/user-listing']);
      },
      error: (error) => {
        this.loadingService.hide();
        this.toastService.showToast(error.error.message);
        this.router.navigate(['/user-listing']);
        console.log(error);
      }
    });
  }

  setDefaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/custom/profile/default.jpg'; // Set the default image path
  }

  getUserDetailsPageData(){
    this.loadingService.show();
    this.apiService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data
      },
      error: (error) => console.error('Failed to fetch user details', error)
    });
    this.apiService.getUserDetails(this.userId).subscribe({
      next: (data) => {
        this.user = data
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Failed to fetch user details', error)
        this.loadingService.hide();
      }
    });
  }

}
