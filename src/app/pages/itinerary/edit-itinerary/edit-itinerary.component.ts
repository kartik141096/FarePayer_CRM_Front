import { Component, ViewChild } from '@angular/core';
import { ApiService } from '../../../api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoadingService } from '../../../loading.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../common/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../toast.service';

declare var $: any;

interface Itinerary { 
  id:number,
  name: string; 
  startDate: string; 
  endDate: string; 
  type: string; 
  duration: string;
  destinations: Destination[];
  itinerary_master : itinerary_master[];
  daysCount:number;  
  adult_count: string; 
  child_count: string; 
  infant_count: string; note: string; 
}

interface Destination {
  id: number;
  destination_id:number,
  name: string;
  type:string
}

interface itinerary_master{
  master_id: number,
  day: number,
  itinerary_destination_id:number,
  day_heading: string | null,
  day_description: string | null
  itinerary_slave:any[]
}

interface number_of_rooms{
  single:number,
  double:number,
  triple:number,
  extra_bed:number,
  CWB:number,
  CNB:number,
}

interface Hotel {  
  id: number;
  hotelId:number,
  name: string;
  img:string;
  category: string;
  destination_name:string
  checkin: string;
  checkout: string;
  roomType:number;
  roomTypeDetail: {
    id: number;
    name: string;
  };
  mealPlan:number;
  mealPlanDetail: {
    id: number;
    name: string;
  };
  numberOfRooms:number_of_rooms;
  roomPrice:number_of_rooms;
}

interface newHotel {  
  hotelId: number;
  name: string;
  category: string;
  checkin: Date;
  checkout: Date;
  roomType: number;
  mealPlan: number;
  numberOfRooms:number_of_rooms;
  roomPrice:number_of_rooms;
}

interface activity{
  id:number;
  name:string;
  destination:string;
  details:string;
  img:string;
  status:boolean;
}

interface ItineraryOptionsList {
  active:string
  hotels: Hotel[];
  activities: activity[];
}

@Component({
  selector: 'app-edit-itinerary',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './edit-itinerary.component.html',
  styleUrl: './edit-itinerary.component.css'
})

export class EditItineraryComponent {

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  
  modelHeading : string |null = "";
  modelDescription : string |null = "";
  renderOnInit = false;
  itineraryMasterID : number = 0;
  activeDay:number = 1;
  activeDayDestination:any = [];
  itineraryOptionsList: ItineraryOptionsList = { active: "", hotels:[], activities:[] }
  roomTypes:any=[];
  mealPlans:any=[];
  Accomodation: Hotel = { 
    id: 0,
    hotelId: 0, 
    name: '', 
    category: '', 
    destination_name: '',
    img:'',
    checkin:new Date().toISOString().split('T')[0], 
    checkout:new Date().toISOString().split('T')[0],
    mealPlan:0, 
    mealPlanDetail:{ id: 0, name: '' }, 
    roomType:0,
    roomTypeDetail:{ id: 0, name: '' }, 
    numberOfRooms:{
      single:0,
      double:0,
      triple:0,
      extra_bed:0,
      CWB:0,
      CNB:0,
    },
    roomPrice:{
      single:0,
      double:0,
      triple:0,
      extra_bed:0,
      CWB:0,
      CNB:0,
    }
  };
  newAccomodation: newHotel = { 
    hotelId: 0, 
    name: '', 
    category: '', 
    checkin:new Date(), 
    checkout:new Date(), 
    roomType:0, 
    mealPlan:0,
    numberOfRooms:{
      single:0,
      double:0,
      triple:0,
      extra_bed:0,
      CWB:0,
      CNB:0,
    },
    roomPrice:{
      single:0,
      double:0,
      triple:0,
      extra_bed:0,
      CWB:0,
      CNB:0,
    }
  };
  itinerary: Itinerary = { 
    id:0,
    name: '', 
    startDate: '', 
    endDate: '', 
    type: '', 
    daysCount: 0, 
    duration: '', 
    destinations: [], 
    itinerary_master: [{
      master_id: 0,
      day: 0,
      itinerary_destination_id: 0,
      day_heading: null,
      day_description: null,
      itinerary_slave: []
    }],
    adult_count: '0', 
    child_count: '0', 
    infant_count: '0', 
    note: '' 
  };
  newActivity:any = [];

  constructor(
    private apiservice: ApiService,
    private route: ActivatedRoute,
    private LoadingService: LoadingService,
    private toastService: ToastService,
  ){
    this.itinerary.id = +this.route.snapshot.paramMap.get('id')!;
    this.getItineraryDetails();
  }


  getItineraryDetails(){
    this.LoadingService.show();
    this.apiservice.getItineraryDetails(this.itinerary.id).subscribe({
      next: (response) => {
        this.itinerary = response;
        // this.itineraryMasterID = this.itinerary.itinerary_master[0].master_id;
        this.itineraryMasterID = this.itinerary.itinerary_master[this.activeDay-1].master_id;
        const itinerary_destination_id = this.itinerary.itinerary_master[0].itinerary_destination_id;
        const index = this.itinerary.destinations.findIndex( (destination) => destination.id == itinerary_destination_id );
        this.activeDayDestination = this.itinerary.destinations[index];
        this.renderOnInit = true;
        this.getOptionList();
        this.LoadingService.hide();
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
  }

  getOptionList(){
    this.LoadingService.show();
    this.apiservice.getHotelsByDestinations([this.activeDayDestination]).subscribe({
      next: (response) => {
        this.itineraryOptionsList.hotels = response.hotels;
        this.LoadingService.hide();
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
    this.apiservice.getActivitiesByDestinations([this.activeDayDestination]).subscribe({
      next: (response) => {
        this.itineraryOptionsList.activities = response.activities;
        this.LoadingService.hide();
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
  }
  
  updateItineraryDestination(){

    this.LoadingService.show();
    this.apiservice.updateItineraryDestination(this.itinerary.id, this.activeDay, this.activeDayDestination.id).subscribe({
      next: (response) => {
        this.LoadingService.hide();
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
  }
  
  updateDayHeadingOrDescription(){
    this.LoadingService.show();
    this.apiservice.updateItineraryMaster(this.itinerary.id, this.activeDay, this.itinerary.itinerary_master[this.activeDay-1].day_heading, this.itinerary.itinerary_master[this.activeDay-1].day_description).subscribe({
      next: (response) => {
        this.closeModal('editDayHeadModal');
        this.LoadingService.hide();
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
  }

  editItineraryItem(id:number, type:string){
    this.LoadingService.show();
    this.apiservice.getItineraryItemByIdAndTable(id, type).subscribe({
      next: (response) => {
        
        if(type == 'itinerary_hotel'){

          this.Accomodation.id = id;
          this.Accomodation.hotelId = response.hotel_details.id;
          this.Accomodation.name = response.hotel_details.name;
          this.Accomodation.category = response.hotel_details.category;
          this.Accomodation.checkin = this.dateFormat(response.checkin,2);
          this.Accomodation.checkout = this.dateFormat(response.checkout,2);
          this.Accomodation.roomType = response.room_type_details.id;
          this.Accomodation.roomTypeDetail.id = response.room_type_details.id;
          this.Accomodation.roomTypeDetail.name = response.room_type_details.id;
          this.Accomodation.mealPlan = response.meal_plan_details.id;
          this.Accomodation.mealPlanDetail.id = response.meal_plan_details.id;
          this.Accomodation.mealPlanDetail.name = response.meal_plan_details.name;
          this.Accomodation.numberOfRooms.single = response.single;
          this.Accomodation.numberOfRooms.double = response.double;
          this.Accomodation.numberOfRooms.triple = response.triple;
          this.Accomodation.numberOfRooms.extra_bed = response.extra_bed;
          this.Accomodation.numberOfRooms.CWB = response.CWB;
          this.Accomodation.numberOfRooms.CNB = response.CNB;
          this.Accomodation.roomPrice.single = response.single_price;
          this.Accomodation.roomPrice.double = response.double_price;
          this.Accomodation.roomPrice.triple = response.triple_price;
          this.Accomodation.roomPrice.extra_bed = response.extra_bed_price;
          this.Accomodation.roomPrice.CWB = response.CWB_price;
          this.Accomodation.roomPrice.CNB = response.CNB_price;

          this.filterHotelPrice(this.Accomodation);
          this.openModal('updateHotelModal');
          this.LoadingService.hide();
        }
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
    

  }

  updateItineraryHotel(){
    this.LoadingService.show();
    this.apiservice.updateItineraryHotel(this.Accomodation).subscribe({
      next: (response) => {
        this.closeModal('updateHotelModal');
        this.toastService.showToast(response.message);
        this.LoadingService.hide();
        this.getItineraryDetails();
      },
      error: (error) => {
        this.toastService.showToast(error.error.message);
        this.LoadingService.hide();
      }
    });
  }

  deleteItineraryHotel(){
    this.LoadingService.show();
    this.apiservice.deleteItinerarySlave(this.Accomodation.id).subscribe({
      next: (response) => {
        this.closeModal('updateHotelModal');
        this.toastService.showToast(response.message);
        this.LoadingService.hide();
        this.getItineraryDetails();
      },
      error: (error) => {
        this.toastService.showToast(error.error.message);
        this.LoadingService.hide();
      }
    });
  }
  
  renderOptionList(event : any){

    const selectedOption = event.target.value;
    if(selectedOption == 'Accommodation'){
        this.itineraryOptionsList.active = 'Accommodation';
        this.itineraryOptionsList.hotels = this.itineraryOptionsList.hotels;
    }
    if(selectedOption == 'Activity'){
      this.itineraryOptionsList.active = 'Activity';
      this.itineraryOptionsList.activities = this.itineraryOptionsList.activities;
    }
    console.log(this.itineraryOptionsList)
  }

  openModal(id:string){
    $('#'+id).modal('show');
  }

  closeModal(id:string) {
    $('#'+id).modal('hide');
  }

  filterHotelPrice(hotel:any){
    this.apiservice.filterHotelPrice(hotel).subscribe({
      next: (response) => {
        this.mealPlans = response.meal_plans;
        this.roomTypes = response.room_types;
        this.newAccomodation.roomPrice.single = response.data[0].single_price;
        this.newAccomodation.roomPrice.double = response.data[0].double_price;
        this.newAccomodation.roomPrice.triple = response.data[0].triple_price;
        this.newAccomodation.roomPrice.extra_bed = response.data[0].extra_bed;
        this.newAccomodation.roomPrice.CWB = response.data[0].CWB_price;
        this.newAccomodation.roomPrice.CNB = response.data[0].CNB_price;
        this.LoadingService.hide();
      },
      error: (error) => {
        this.LoadingService.hide();
      }
    });
  }

  AddHotelToItinerary(){
    this.apiservice.AddHotelToItinerary(this.itinerary.id,this.itineraryMasterID, this.newAccomodation).subscribe({
      next: (response) => {
        this.toastService.showToast(response.message)
        this.mealPlans = response.meal_plans;
        this.roomTypes = response.room_types;
        this.closeModal('addHotelModal');
        this.getItineraryDetails();
        this.clearNewAccomodationData();
      },
      error: (error) => {
        this.toastService.showToast("All the fields are required")
      }
    });
  }

  addHotel(id:number, name:string){
    this.LoadingService.show();
    this.newAccomodation.hotelId = id;
    this.newAccomodation.name = name;

    this.filterHotelPrice(this.newAccomodation);
  }

  addActivity(id:number){
    this.LoadingService.show();
    this.newActivity.activityId = id;

    this.apiservice.addActivityToItinerary(this.itinerary.id, this.itineraryMasterID, this.newActivity.activityId).subscribe({
      next: (response) => {
        this.toastService.showToast(response.message)
        this.closeModal('addHotelModal');
        this.getItineraryDetails();
        this.clearNewAccomodationData();
      },
      error: (error) => {
        this.toastService.showToast("All the fields are required")
      }
    });
    // this.filterHotelPrice(this.newAccomodation);
  }

  changeActiveDay(day:number){
    if(day !== this.activeDay){
      this.activeDay = day;
      this.itineraryMasterID = this.itinerary.itinerary_master[this.activeDay-1].master_id;
      const itinerary_destination_id = this.itinerary.itinerary_master[this.activeDay-1].itinerary_destination_id;
      const index = this.itinerary.destinations.findIndex( (destination) => destination.id == itinerary_destination_id );
      this.activeDayDestination = this.itinerary.destinations[index];
      this.itineraryOptionsList.active = '';
    }
  }
  
  dateFormat(oldDate:string, type:number=1): string {
    const date = new Date(oldDate);

    if(type == 1){
      
      return date instanceof Date && !isNaN(date.getTime()) 
      ? date.toLocaleDateString('en-GB') 
      : '';

    }else{
      
      if (date instanceof Date && !isNaN(date.getTime())) {
        date.setDate(date.getDate() + 1);
        
        return date.toISOString().split('T')[0];
      } else {
        return '';
      }
    }
  }

  changeDayDestination(event : any){
    const selectedOption = event.target.value;
    const index = this.itinerary.destinations.findIndex( (destination) => destination.id == selectedOption );
    this.activeDayDestination = this.itinerary.destinations[index];
    this.updateItineraryDestination();
    this.getOptionList();
  }

  clearNewAccomodationData(){
    this.newAccomodation = { 
      hotelId: 0, 
      name: '', 
      category: '', 
      checkin:new Date(), 
      checkout:new Date(), 
      roomType:0, 
      mealPlan:0,
      numberOfRooms:{
        single:0,
        double:0,
        triple:0,
        extra_bed:0,
        CWB:0,
        CNB:0,
      },
      roomPrice:{
        single:0,
        double:0,
        triple:0,
        extra_bed:0,
        CWB:0,
        CNB:0,
      }
    }
  }

  setDefaultImage(event: Event, type:string) {
    
    const imgElement = event.target as HTMLImageElement;
    
    if(type == 'hotel'){
      imgElement.src = 'assets/img/icons/custom/settings/hotel.webp';
    }
    if(type == 'activity'){
      imgElement.src = 'assets/img/icons/custom/settings/activities.png';
    }
  }

}
