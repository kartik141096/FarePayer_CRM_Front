import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  // AUTH APIS ==================================================================

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

  // Query APIS =================================================================

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
    }
  ): Observable<any>
  {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.post(`${this.apiUrl}getQueries?page=`+page, filterData, { headers });
  }

  addQuery(query:{
    mobile: string,
    email: string,
    title: string,
    name: string,
    destination: string,
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






}
