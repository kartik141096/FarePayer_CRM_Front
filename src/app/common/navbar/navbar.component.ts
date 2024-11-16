import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ApiService } from '../../api.service';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../../loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService:AuthService, private apiservice:ApiService, private loadingService:LoadingService) { }
  user_id:any;
  user_role:any;
  
  user = {
    id:0,
    name:'',
    email:'',
    mobile:'',
    user_type:'',
    role_id:0,
    img:'',
    type:''
  }

  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id');
    this.user_role = localStorage.getItem('user_role');
    this.getUserDetails(this.user_id);
  }

  setDefaultImage(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/img/custom/profile/default.jpg'; // Set the default image path
  }

  getUserDetails(userId:number){
    this.loadingService.show();
    this.apiservice.getUserDetails(userId).subscribe({
      next: (data) => {
        this.user = data
        if(this.user.img=='')
          this.user.img = 'default.jpg';
        console.log()
            this.loadingService.hide();
      },
      error: (error) => {
        console.error('Failed to fetch user details', error)
        this.loadingService.hide();
      }
    });
  }

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
