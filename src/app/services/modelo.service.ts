import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config'; // Ajusta la ruta según la ubicación de tu archivo de configuración

@Injectable({
  providedIn: 'root'
})
export class ModeloService {

  private ModelosUrl = `${environment.apiUrl}/models`;

  constructor(private http: HttpClient) { }

  getModelos(): Observable<any> {
    return this.http.get(this.ModelosUrl);
  }

  getModeloById(id: number): Observable<any> {
    return this.http.get(`${this.ModelosUrl}/${id}`);
  }

  createModelo(modelo: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.ModelosUrl, modelo, { observe: 'response' });
  }

  updateModelo(id: number, modelo: any): Observable<any> {
    return this.http.put(`${this.ModelosUrl}/${id}`, modelo);
  }

  deleteModelo(id: number): Observable<any> {
    return this.http.delete(`${this.ModelosUrl}/${id}`);
  }
}