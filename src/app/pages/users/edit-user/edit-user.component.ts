import { Component, ViewChild, ElementRef, ChangeDetectorRef  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../loading.service';
import { ApiService } from '../../../api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})

export class EditUserComponent {

  constructor(
    private loadingService:LoadingService,
    private route: ActivatedRoute,
    private apiService:ApiService,
    private toastService:ToastService,
    private router:Router,
    private cdr: ChangeDetectorRef,
  ){
    this.userId = +this.route.snapshot.paramMap.get('id')!;
    this.getUserDetailsPageData();
  }
  
  userId:number;
  roles: { id: number, role_name: string, img: string }[] = [];
  user = { id:0, name:'', email:'', mobile:'', user_type:'', role_id:1, img:'', type:'' }
  selectedRoleId: number | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  addQuery = {
    img: '',
    mobile: '',
    email: '',
    name: '',
  };

  onSubmit() {
    const file = this.fileInput?.nativeElement?.files[0]; // Using optional chaining
    const formData = new FormData();
    formData.append('id', this.user.id.toString());
    formData.append('name', this.user.name);
    formData.append('email', this.user.email);
    formData.append('mobile', this.user.mobile);
    formData.append('user_type', this.user.user_type);
    if (this.selectedRoleId != null) {
      formData.append('role_id', this.selectedRoleId.toString());
    } else {
      console.error('Role ID is null or undefined');
      return;
    }
    if (file) {
      formData.append('img', file);
    }
    this.apiService.updateUser(this.userId, formData).subscribe({
      next: () => {
        this.toastService.showToast("User updated successfully");
        this.router.navigate([`/user-details/${this.userId}`]);
      },
      error: (error) => {
        console.error('Failed to update user', error);
        this.toastService.showToast(error.error.message);
      }
    });
  }

  setDefaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/custom/profile/default.jpg'; // Set the default image path
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.img = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }
  
  openFileUploader() {
    this.fileInput.nativeElement.click();
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
        this.selectedRoleId = this.user.role_id;
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Failed to fetch user details', error)
        this.loadingService.hide();
      }
    });
  }

}
