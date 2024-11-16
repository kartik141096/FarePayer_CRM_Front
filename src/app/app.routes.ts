import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QueryListingComponent } from './pages/query/query-listing/query-listing.component';
import { AddQueryComponent } from './pages/query/add-query/add-query.component';
import { ItineraryListingComponent } from './pages/itinerary/itinerary-listing/itinerary-listing.component';
import { AddItineraryComponent } from './pages/itinerary/add-itinerary/add-itinerary.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';
import { UserListingComponent } from './pages/users/user-listing/user-listing.component';
import { UserDetailsComponent } from './pages/users/user-details/user-details.component';
import { EditUserComponent } from './pages/users/edit-user/edit-user.component';
import { AddUserComponent } from './pages/users/add-user/add-user.component';
import { ChangePasswordComponent } from './pages/users/change-password/change-password.component';
import { EditItineraryComponent } from './pages/itinerary/edit-itinerary/edit-itinerary.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { RoomTypeComponent } from './pages/room-type/room-type.component';


export const routes: Routes = [

    {
        path:'settings/room-type',
        component:RoomTypeComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'settings',
        component:SettingsComponent,
        canActivate: [AuthGuard]

    },
    {
        path:'dashboard',
        component:DashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'query-listing',
        component:QueryListingComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'add-query',
        component:AddQueryComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'itinerary-listing',
        component:ItineraryListingComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'add-itinerary',
        component:AddItineraryComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'edit-itinerary/:id',
        component:EditItineraryComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'user-listing',
        component:UserListingComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'user-details/:id',
        component:UserDetailsComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'edit-user/:id',
        component:EditUserComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'add-user',
        component:AddUserComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'change-password/:id',
        component:ChangePasswordComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'login',
        component:LoginComponent
    },
    { 
        path: '', 
        redirectTo: '/dashboard', 
        pathMatch: 'full' 
    },
    { 
        path: '**', 
        redirectTo: '/dashboard' 
    },
];
