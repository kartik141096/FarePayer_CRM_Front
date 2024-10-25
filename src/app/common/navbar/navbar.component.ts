import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ApiService } from '../../api.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService:AuthService, private apiservice:ApiService) { }

  logout():void{

    this.apiservice.logout().subscribe({
      next: (response) => {
        this.authService.logout();
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
    
  }
}
