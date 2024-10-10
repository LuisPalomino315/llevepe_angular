import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/config'; // Ajusta la ruta según la ubicación de tu archivo de configuración

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private salesUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getSales(): Observable<any[]> {
    return this.http.get<any[]>(this.salesUrl);
  }

  getSaleById(id: number): Observable<any> {
    return this.http.get(`${this.salesUrl}/${id}`);
  }

  createSale(sale: any): Observable<any> {
    return this.http.post(this.salesUrl, sale);
  }

  updateSale(id: number, sale: any): Observable<any> {
    return this.http.put(`${this.salesUrl}/${id}`, sale);
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.salesUrl}/${id}`);
  }

  getCustomer(phone: number): Observable<any> {
    return this.http.post(`${this.salesUrl}/findClient`, {telefono: phone});
  }
}