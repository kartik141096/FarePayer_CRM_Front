import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }


  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }


  login(token: string): void {
    localStorage.setItem('access_token', token);
    this.router.navigate(['admin/dashboard']);
  }
}
