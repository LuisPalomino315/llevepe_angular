import { Injectable } from '@angular/core';
import { HttpClient,HttpResponse  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config'; // Ajusta la ruta según la ubicación de tu archivo de configuración

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get(this.productsUrl);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.productsUrl}/${id}`);
  }

  createProduct(product: any): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.productsUrl, product, { observe: 'response' });
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.productsUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.productsUrl}/${id}`);
  }
}