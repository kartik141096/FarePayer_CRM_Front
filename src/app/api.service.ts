import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Destination {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }


// ===============================================================================================================================================================
// =========================================================== User APIs =========================================================================================
// ===============================================================================================================================================================

  register(newUser:{name: string, mobile: string, email: string, user_type: string, role_id: string, password: string, }){
    return this.http.post<any>(this.apiUrl + 'register', newUser);
  }

  login(credentials: { email: string, password: string }): Observable<any> {

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

  getUserList(
    page:string,
    filterData:any
  ): Observable<any> {
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
    destination: number,
    from_date: string,
    to_date: string,
    adult_count: string,
    child_count: string,
    infant_count: string,
    source: string,
    priority: string,
    assign_to: string,
    remarks: string
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
  
    return this.http.get<any[]>(`${this.apiUrl}search-cities`, { headers, params });
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
}
