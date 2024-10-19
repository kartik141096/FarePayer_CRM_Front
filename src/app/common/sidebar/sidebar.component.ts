// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';



// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
//   templateUrl: './sidebar.component.html',
//   styleUrl: './sidebar.component.css'
// })
// export class SidebarComponent {

//   menuStates: { [key: string]: boolean } = {};

//   toggleMenu(menuKey: string) {
//     this.menuStates[menuKey] = !this.menuStates[menuKey];
//   }
// }




import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class SidebarComponent implements OnInit, OnDestroy {
  menuStates: { [key: string]: boolean } = {};
  currentRoute: string | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Subscribe to router events to listen for route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  toggleMenu(menuKey: string) {
    this.menuStates[menuKey] = !this.menuStates[menuKey];
  }

  ngOnDestroy(): void {

  }
}
