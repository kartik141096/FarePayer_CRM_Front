import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd  } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, SidebarComponent, NavbarComponent, LoginComponent, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  constructor(private router: Router) {}
  
  title = 'farepayer_admin';
  is_login_page = 1;

  ngOnInit(): void {
    // Subscribe to route changes to detect the current URL
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Check if the current URL contains 'login'
        this.is_login_page = event.urlAfterRedirects.includes('/login') ? 1 : 0;
      });
  }



}
