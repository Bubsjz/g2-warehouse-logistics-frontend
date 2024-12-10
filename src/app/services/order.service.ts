import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Delivery, Warehouse, Truck, Product, CombinedResponse } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}



  // OBTENER DATOS SELECTORES FORMULARIO
  getCombinedData(): Observable<{ warehouse: Warehouse[]; truck: Truck[]; productNames: Product[] }> {
    const url = `${this.baseUrl}/operator/create-order`;
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
    console.log('POST URL:', `${this.baseUrl}/operator/create-order`);
    console.log('POST payload:', delivery);
    return this.http.post<Delivery>(`${this.baseUrl}/operator/create-order`, delivery);
  }

  // Actualizar envío
  updateDelivery(id: number, delivery: any): Observable<any> {
    const url = `${this.baseUrl}/operator/modify-order/${id}`;
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

  // Cambiar estado de un envío en modo revisión (basado en status que se envía)
  updateDeliveryStatus(id: number, status: string, comments: string | null = null): Observable<Delivery> {
    const payload = { comments, status };
    const url = ['ready for departure', 'corrections needed'].includes(status)
    ? `${this.baseUrl}/manager/review-order/${id}`
    : ['approved', 'not approved'].includes(status)
    ? `${this.baseUrl}/manager/verify-order/${id}`
    : '';

    if (!url) {
      console.error('Invalid status provided:', status);
      return throwError(() => new Error('Invalid status provided.'));
    }
    
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



