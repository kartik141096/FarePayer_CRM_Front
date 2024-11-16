import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';
import { ToastService } from '../../toast.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  passtext = 'password';

  constructor(
    private apiservice: ApiService, 
    private authService:AuthService, 
    private toastService:ToastService,
  ){}

  loginForm = {
    email: '',
    password: ''
  };

  changePasstext(){
    if(this.passtext == 'password')
      this.passtext = 'text';
    else
      this.passtext = 'password';
  }

  onSubmit(): void {
    this.apiservice.login(this.loginForm).subscribe({
      next: (response) => {
        this.authService.login(response.token, response.role.id, response.user_type, response.user_id);
      },
      error: (error) => {
        console.error('Login fails:', error);
        this.toastService.showToast(error.error.error);
      }
    });
  }

}
