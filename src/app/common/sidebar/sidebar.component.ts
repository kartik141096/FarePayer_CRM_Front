import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {
  
  menuStates: { [key: string]: boolean } = {};
  currentRoute: string | undefined;
  userRole = localStorage.getItem('user_role');
  user_type = localStorage.getItem('user_type');
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    
    this.currentRoute = this.router.url;
    this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      });
  }

  activeRoute(pages:string): boolean {

    const pageArr = pages.split("|");
    return pageArr.some(page => this.currentRoute?.startsWith('/' + page));
  }

  toggleMenu(menuKey: string) {

    if (this.menuStates[menuKey]) {
      this.menuStates[menuKey] = false;
    } else {
      // Close all other menus first
      for (const key in this.menuStates) {
        if (this.menuStates.hasOwnProperty(key) && key !== menuKey) {
          this.menuStates[key] = false; // Close all other menus
        }
      }
  
      // Toggle the selected menu (open it)
      this.menuStates[menuKey] = !this.menuStates[menuKey];
    }
  }

}
