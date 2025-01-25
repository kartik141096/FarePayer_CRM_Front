import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Destination {
  id: number;
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = 'http://127.0.0.1:8000/api/';
  // private apiUrl = 'https://test.farepayer.com/api/';

  constructor(private http: HttpClient) { }


// ===============================================================================================================================================================
// =========================================================== User APIs =========================================================================================
// ===============================================================================================================================================================

  register(newUser:{name: string, mobile: string, email: string, user_type: string, role_id: string, password: string, }){
    return this.http.post<any>(this.apiUrl + 'register', newUser);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    console.log(this.apiUrl);

    return this.http.post<any>(this.apiUrl + 'login', credentials);
  }

  logout(){
    
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${this.apiUrl}logout`, {}, { headers });
  }

  isLoggedin(){

    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}isLoggedin`, {}, { headers });

  }

  getUserList( page:string, filterData:any ): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let params = new HttpParams()
    .set('page', page);

  Object.keys(filterData).forEach(key => {
    if (filterData[key]) {
      params = params.set(key, filterData[key]);
    }
  });

  return this.http.get<any>(`${this.apiUrl}getUsers`, { headers, params });
  }

  getSalesUsers(user_type:string): Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getSalesUsers`, { user_type }, { headers });
  }

  getUserDetails(id: number): Observable<any> {

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}getUserDetails/${id}`, {headers});
  }

  deleteUser(id: number): Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}deleteUser/${id}`, {headers});
  }
  
  updateUser(id: number, updatedUserData: any): Observable<any> {
    
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}updateUser/${id}`, updatedUserData, { headers });
  }
  
  changePassword(password:string, id:number){


    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}changePassword/${id}`, { password }, { headers });
  }

  getAllRoles(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}getAllRoles`, {headers});
  }
  
// ===============================================================================================================================================================
// =========================================================== Query APIs ========================================================================================
// ===============================================================================================================================================================
  
  getQueries(
    page:string,
    filterData:{
      created_from: string,
      created_to: string,
      updated_from: string,
      updated_to: string,
      search_by_id: string,
      status: string,
      search_by_name_email_mobile: string,
      destination: string,
      assigned_to: string,
      source: string,
    }): Observable<any>{
      
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${this.apiUrl}getQueries?page=`+ page, filterData, { headers });
  }

  addQuery(query:{
    mobile: string,
    email: string,
    title: string,
    name: string,
    destinations: Destination[],
    from_date: string,
    to_date: string,
    adult_count: string,
    child_count: string,
    infant_count: string,
    source: string,
    priority: string,
    query_type: string,
    assign_to: string,
    remarks: string,
  }):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}addQuery`, query, { headers });
  }

  searchCities(term: string): Observable<any[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    const params = new HttpParams().set('term', term);
  
    return this.http.get<any[]>(`${this.apiUrl}searchDestination`, { headers, params });
  }

  getQueryDestinations(): Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getQueryDestinations`, {}, { headers });
  }


// ===============================================================================================================================================================
// =========================================================== Itinerary APIs ========================================================================================
// ===============================================================================================================================================================
  
  addItinerary(itinerary: {
      name: string,
      startDate: string,
      endDate: string,
      type: string,
      destination: Destination[],
      adult_count: string,
      child_count: string,
      infant_count: string,
      note: string,
    }): Observable<any>{
    
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}addItinerary`, {itinerary}, { headers });
  }

  getItineraries(page:number, filterData:{
    type: string, 
    start_date: string, 
    end_date: string, 
    note: string, 
    name: string, 
    destination: string
  }):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getItineraries?page=`+ page, filterData, { headers });
  }

  getItineraryDetails(id:number):Observable<any>{
    
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getItineraryDetails`, { id }, { headers });
  }

  getItineraryDestinations():Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getItineraryDestinations`, {}, { headers });
  }

  getHotelsByDestinations(destinations:any):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getHotelsByDestinations`, { destinations }, { headers });
  }

  updateItineraryDestination(itinerary_id:number, day:number, itinerary_destination_id:number){
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}updateItineraryMaster`, { itinerary_id, day, itinerary_destination_id }, { headers });
  }

  updateItineraryMaster(itinerary_id:number, day:number, day_heading:string|null, day_description:string|null){
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}updateItineraryMaster`, { itinerary_id, day, day_heading, day_description }, { headers });
  }

  filterHotelPrice(newAccomodation:any):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}filterHotelPrice`,{ newAccomodation }, { headers });
  }
  
  AddHotelToItinerary(itinerary_id:number, itinerary_master_id:number, newAccomodation:any):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}AddHotelToItinerary`,{ itinerary_id, itinerary_master_id, newAccomodation }, { headers });
  }

  getItineraryItemByIdAndTable(id:number, table:string):Observable<any>{
    
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}getItineraryItemByIdAndTable`,{ id, table }, { headers });
  }

  updateItineraryHotel(itineraryHotel:any):Observable<any>{
    
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}updateItineraryHotel`,{ itineraryHotel }, { headers });
  }

  deleteItinerarySlave(itinerarySlaveID:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}deleteItinerarySlave`,{ itinerarySlaveID }, { headers });
  }
  
  getItineraryByID(id:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}getItineraryByID`,{ id }, { headers });
  }
  
  updateItinerary(itinerary:any):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}updateItinerary`,{ itinerary }, { headers });
  }

  getActivitiesByDestinations(destinations:any):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getActivitiesByDestinations`, { destinations }, { headers });
  }

  addActivityToItinerary(itinerary_id:number, itinerary_master_id:number, activity_id:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}addActivityToItinerary`,{ itinerary_id, itinerary_master_id, activity_id }, { headers });
  }


  
// ===============================================================================================================================================================
// =========================================================== Settings APIs ========================================================================================
// ===============================================================================================================================================================
  

  getRoomTypes(page:number):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getRoomTypes`, { page }, { headers });
  }

  deleteRoomType(id:number):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}deleteRoomType`, { id }, { headers });
  }
  
  changeRoomTypeStatus(id:number, status:boolean):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}changeRoomTypeStatus`, { id,status }, { headers });
  }
  
  addRoomType(name:string):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}addRoomType`, { name }, { headers });
  }
  
  getMealPlan(page:number):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getMealPlan`, { page }, { headers });
  }
  
  deleteMealPlan(id:number):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}deleteMealPlan`, { id }, { headers });
  }
  
  changeMealPlanStatus(id:number, status:boolean):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}changeMealPlanStatus`, { id,status }, { headers });
  }
  
  addMealPlan(name:string):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}addMealPlan`, { name }, { headers });
  }
  
  getAllHotels(page:number):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getAllHotels`, { page }, { headers });
  }

  addhotel(hotel:any):Observable<any>
  {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}addhotel`,  hotel , { headers });
  }
  
  updateHotel(hotel:FormData):Observable<any>
  {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}updateHotel`, hotel , { headers });
  }

  changeHotelStatus(id:number, status:boolean):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}changeHotelStatus`, { id,status }, { headers });
  }
  
  findDestinationName(id:string, table:string):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}findDestinationName`, { id, table }, { headers });
  }

  deleteHotel(id:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.get(`${this.apiUrl}deleteHotel/${id}`, { headers });
  }

  addHotelPrice(hotelPrice:{
    hotel_master_id: number,
    from_date: string,
    to_date: string,
    room_type: number,
    meal_plan: number,
    single_price: number,
    double_price: number,
    triple_price: number,
    extra_bed: number,
    CWB_price: number,
    CNB_price: number,
  }):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}addHotelPrice`, {hotelPrice}, { headers });
  }

  getHotelPriceList(hotel_master_id:number, page:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}getHotelPriceList`,{hotel_master_id, page}, { headers });
  }

  deleteHotelPrice(id:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}deleteHotelPrice`,{id}, { headers });
  }

  getRoomTypeOrMealPlanByID(id:number, table:string):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}getRoomTypeOrMealPlanByID`,{ id, table }, { headers });
  }

  getAllActivities(page:number):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getAllActivities`, { page }, { headers });
  }
  
  addActivity(activity:any):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}addActivity`, activity , { headers });
  }

  changeActivityStatus(id:number, status:boolean):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}changeActivityStatus`, { id,status }, { headers });
  }
  
  deleteActivity(id:number):Observable<any>{
    
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.get(`${this.apiUrl}deleteActivity/${id}`, { headers });
  }
  
  updateActivity(activity:FormData):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}updateActivity`, activity, { headers });
  }

  addActivityPrice(activityPrice:any):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}addActivityPrice`, {activityPrice}, { headers });
  }

  getActivityPriceList(activity_master_id:number, page:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}getActivityPriceList`,{activity_master_id, page}, { headers });
  }

  deleteActivityPrice(id:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}deleteActivityPrice`,{id}, { headers });
  }

  addTransfer(transfer:any):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}addTransfer`, transfer , { headers });
  }

  getAllTransfers(page:number):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getAllTransfers`, { page }, { headers });
  }

  changeTransferStatus(id:number, status:boolean):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}changeTransferStatus`, { id,status }, { headers });
  }

  updateTransfer(transfer:FormData):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}updateTransfer`, transfer, { headers });
  }

  deleteTransfer(id:number):Observable<any>{
    
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.get(`${this.apiUrl}deleteTransfer/${id}`, { headers });
  }

  addTransferPrice(transferPrice:any):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}addTransferPrice`, { transferPrice }, { headers });
  }

  getTransferPriceList(transfers_master_id:number, page:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}getTransferPriceList`,{transfers_master_id, page}, { headers });
  }

  deleteTransferPrice(id:number):Observable<any>{

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.post(`${this.apiUrl}deleteTransferPrice`,{id}, { headers });
  }

  addSupplier(supplier:any):Observable<any>
  {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}addSupplier`,  supplier , { headers });
  }

  getAllSuppliers(page:number):Observable<any>{
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
  
    return this.http.post(`${this.apiUrl}getAllSuppliers`, { page }, { headers });
  }

  deleteSupplier(id:number):Observable<any>{
    
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    });
    
    return this.http.get(`${this.apiUrl}deleteSupplier/${id}`, { headers });
  }
}
