// import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../toast.service';
import { ApiService } from '../../../api.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoadingService } from '../../../loading.service';



@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

  user = { password:'', confirmPassword: ''  }
  userId:number;

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
  ){
    this.userId = +this.route.snapshot.paramMap.get('id')!;
  }

  onSubmit(){

    if (this.user.password !== this.user.confirmPassword) {
      this.toastService.showToast("Password Doesn't matches");
      return;
    }
    // const userId = +this.route.snapshot.paramMap.get('id')!;

    this.apiService.changePassword(this.user.password, this.userId).subscribe({
      next: (data:any) => {
        this.toastService.showToast(data.message);
        this.router.navigate([`/user-details/${this.userId}`]);
        this.loadingService.hide();
      },
      error: (error) => {
        console.log()
        console.error('Failed to fetch user details', error)
        this.toastService.showToast(error.error.message);
        this.loadingService.hide();
      }
    });

  }
}
