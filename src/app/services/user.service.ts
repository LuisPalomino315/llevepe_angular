import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config'; // Ajusta la ruta según la ubicación de tu archivo de configuración

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(this.usersUrl);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.usersUrl}/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(this.usersUrl, user);
  }

  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.usersUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${id}`);
  }
}