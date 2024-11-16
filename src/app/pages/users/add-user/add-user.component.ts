import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../loading.service';
import { ApiService } from '../../../api.service';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  
  @ViewChild('fileInput') fileInput!: ElementRef;

  roles: { id: number, role_name: string, img: string }[] = [];
  user = { name:'', email:'', mobile:'', user_type:'', role_id:'', img:'', type:'', password:'', confirmPassword: ''  }
  selectedRoleId: number | null = null;


  constructor(
    private loadingService: LoadingService,
    private apiService: ApiService,
    private toastService: ToastService,
    private router: Router,
  ){
    this.getUserRolesList();
  }

  getUserRolesList(){
    this.loadingService.show();
    this.apiService.getAllRoles().subscribe({
      next: (data) => {
        this.roles = data
        if (this.roles && this.roles.length > 0) {
          this.selectedRoleId = 0;
        }
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Failed to fetch user details', error)
        this.loadingService.hide();
      }
    });
  }

  onSubmit(){

    if (this.user.password !== this.user.confirmPassword) {
      this.toastService.showToast("Password Doesn't matches");
      return;
    }

    const roleId = this.selectedRoleId ? this.selectedRoleId.toString() : '';
    const newUser = {
      name: this.user.name,
      mobile: this.user.mobile,
      email: this.user.email,
      user_type: this.user.user_type,
      role_id: roleId,
      password: this.user.password,
    };

    this.loadingService.show();
    this.apiService.register(newUser).subscribe({
      next: (data) => {
        console.log(data.message)
        this.toastService.showToast(data.message);
        this.router.navigate([`/user-details/${data.user_id}`]);
        this.loadingService.hide();
      },
      error: (error) => {
        console.error('Failed to fetch user details', error)
        this.toastService.showToast(error.error.errors['0']);
        this.loadingService.hide();
      }
    });
  }
}
