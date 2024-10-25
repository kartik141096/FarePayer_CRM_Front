import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private apiUrl = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {

    return this.http.post<any>(this.apiUrl + 'login', credentials);
  }

  logout(){
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log(headers)
    // return this.http.get<any>(this.apiUrl + 'logout');
    return this.http.post(`${this.apiUrl}logout`, {}, { headers });
  }

}
