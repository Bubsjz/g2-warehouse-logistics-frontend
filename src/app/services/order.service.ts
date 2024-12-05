import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Delivery, Warehouse, Truck, Product, CombinedResponse } from '../interfaces/order.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}



  // OBTENER DATOS SELECTORES FORMULARIO
  getCombinedData(): Observable<{ warehouse: Warehouse[]; truck: Truck[]; productNames: Product[] }> {
    const url = `${this.baseUrl}/operator/creation-data`;
    return this.http.get<{ warehouse: Warehouse[]; truck: Truck[]; productNames: Product[] }>(url);
  }

  // Obtener envío por ID
  getDeliveryById(id: number, role: string): Observable<CombinedResponse> {
    const url = role === 'operator'
      ? `${this.baseUrl}/operator/modify-order/${id}`
      : `${this.baseUrl}/manager/review-order/${id}`;
    console.log('Fetching delivery data from URL:', url);
    return this.http.get<CombinedResponse>(url);
  }

  // Crear envío
  createDelivery(delivery: Delivery): Observable<Delivery> {
    return this.http.post<Delivery>(`${this.baseUrl}/create-order`, delivery);
  }

  updateDelivery(id: number, delivery: any): Observable<any> {
    const url = `${this.baseUrl}/operator/update-delivery/${id}`;
    console.log('PUT URL:', url);
    console.log('PUT payload:', delivery);
    return this.http.put(url, delivery).pipe(
      tap(response => {
        console.log('PUT response:', response);
      })
    );
  }

  // Eliminar envío
  deleteDelivery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/modify-order/${id}`);
  }

  // Cambiar estado de un envío
  updateDeliveryStatus(id: number, status: string, comments: string | null = null): Observable<Delivery> {
    const payload = { comments, status };
    const url = `${this.baseUrl}/manager/review-order/${id}`;
    
    const headers = {
      headers: { 'Content-Type': 'application/json' }
    };

    console.log('PUT URL:', url);
    console.log('PUT payload:', payload);
    
    return this.http.put<Delivery>(url, payload, headers).pipe(
      tap(response => {
          console.log('PUT response:', response);
      }),
      catchError(error => {
          console.error('Error details:', {
              url,
              payload,
              headers,
              error
          });
          return throwError(() => new Error('Failed to update delivery status.'));
      })
    );
  }

}



