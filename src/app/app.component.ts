import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd  } from '@angular/router';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule, ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { ToastComponent } from './common/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, LoginComponent, CommonModule, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
  loading$;
  constructor(
    private router: Router, 
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private viewportScroller: ViewportScroller
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  title = 'farepayer_admin';
  is_login_page = 1;

  ngOnInit(): void {
    
    // Subscribe to route changes to detect the current URL
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.is_login_page = event.urlAfterRedirects.includes('/login') ? 1 : 0;
        if (event instanceof NavigationEnd) {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
        this.cdr.detectChanges();
      });
  }



}
