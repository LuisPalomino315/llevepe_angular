import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config'; // Ajusta la ruta según la ubicación de tu archivo de configuración

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categorysUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  getCategorys(): Observable<any> {
    return this.http.get(this.categorysUrl);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${this.categorysUrl}/${id}`);
  }

  createCategory(category: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.categorysUrl, category, { observe: 'response' });
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put(`${this.categorysUrl}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.categorysUrl}/${id}`);
  }
}