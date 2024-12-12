import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<CombinedResponse>(url);
  }

  // Crear envío
  createDelivery(delivery: Delivery): Observable<Delivery> {
    return this.http.post<Delivery>(`${this.baseUrl}/operator/create-order`, delivery);
  }

  // Actualizar envío
  updateDelivery(id: number, delivery: any): Observable<any> {
    return this.http.delete<void>(`${this.baseUrl}/operator/modify-order/${id}`);
  }

  // Eliminar envío
  deleteDelivery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/operator/modify-order/${id}`);
  }

  // Cambiar estado de un envío en modo revisión (basado en status que se envía)
  updateDeliveryStatus(id: number, status: string, comments: string | null = null): Observable<Delivery> {
    const payload = { comments, status };
    const url = ['ready for departure', 'corrections needed'].includes(status)
    ? `${this.baseUrl}/manager/review-order/${id}`
    : ['approved', 'not approved'].includes(status)
    ? `${this.baseUrl}/manager/verify-order/${id}`
    : '';
    return this.http.put<Delivery>(url, payload);
  }
}


