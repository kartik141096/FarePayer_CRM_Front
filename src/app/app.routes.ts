import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QueryListingComponent } from './pages/query/query-listing/query-listing.component';
import { AddQueryComponent } from './pages/query/add-query/add-query.component';
import { ItineraryListingComponent } from './pages/itinerary/itinerary-listing/itinerary-listing.component';
import { AddItineraryComponent } from './pages/itinerary/add-itinerary/add-itinerary.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: '/dashboard', 
        pathMatch: 'full' 
    },

    {
        path:'login',
        component:LoginComponent
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
        path: '**', 
        redirectTo: '/dashboard' 
    },
];
