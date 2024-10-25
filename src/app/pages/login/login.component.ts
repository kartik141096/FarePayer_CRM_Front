import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

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

  constructor(private apiservice: ApiService, private router:Router, private authService:AuthService){}

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

  ngOnInit(): void {
    if (this.authService.isLoggedIn()){
      this.router.navigate(['/dashboard']);
    }
  }



  onSubmit(): void {
    this.apiservice.login(this.loginForm).subscribe({
      next: (response) => {
        this.authService.login(response.token.plainTextToken);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

}
