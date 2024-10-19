import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { QueryListingComponent } from './pages/query/query-listing/query-listing.component';
import { AddQueryComponent } from './pages/query/add-query/add-query.component';
import { ItineraryListingComponent } from './pages/itinerary/itinerary-listing/itinerary-listing.component';
import { AddItineraryComponent } from './pages/itinerary/add-itinerary/add-itinerary.component';


export const routes: Routes = [
    {
        path:'',
        component:DashboardComponent
    },
    {
        path:'query-listing',
        component:QueryListingComponent
    },
    {
        path:'add-query',
        component:AddQueryComponent
    },
    {
        path:'itinerary-listing',
        component:ItineraryListingComponent
    },
    {
        path:'add-itinerary',
        component:AddItineraryComponent
    },
];
