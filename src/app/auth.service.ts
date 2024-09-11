import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/config'; // Ajusta la ruta según la ubicación de tu archivo de configuración

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = `${environment.apiUrl}${environment.loginEndpoint}`;

  constructor(private http: HttpClient) { }

  login(email: string, pass: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, pass });
  }
}