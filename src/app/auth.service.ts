import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private apiservice:ApiService, private toastService:ToastService) {}

  isLoggedIn(): boolean {

    this.apiservice.isLoggedin().subscribe({
      next: (response) => {
        return true;
      },
      error: (error) => {
        this.toastService.showToast("Unauthorised User");
        this.logout();
        return false;
      }
    });
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_type');
    this.router.navigate(['/login']);
  }

  login(token: string, role:string, user_type:string, user_id:string): void {
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('user_role', role);
    localStorage.setItem('user_type', user_type);
    localStorage.setItem('access_token', token);
    this.router.navigate(['/dashboard']);
  }


}
