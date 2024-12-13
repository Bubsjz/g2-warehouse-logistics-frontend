import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Delivery, Warehouse, Truck, Product, CombinedResponse } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})

export class DeliveryService {
  private baseUrlOperator = environment.API_URL + '/operator';
  private baseUrlManager = environment.API_URL + '/manager';

  constructor(private http: HttpClient) {}

  // OBTENER DATOS SELECTORES FORMULARIO
  getCombinedData(): Observable<{ warehouse: Warehouse[]; truck: Truck[]; productNames: Product[] }> {
    const url = `${this.baseUrlOperator}/create-order`;
    return this.http.get<{ warehouse: Warehouse[]; truck: Truck[]; productNames: Product[] }>(url);
  }

  // Obtener envío por ID
  getDeliveryById(id: number, role: string): Observable<CombinedResponse> {
    const url = role === 'operator'
      ? `${this.baseUrlOperator}/modify-order/${id}`
      : `${this.baseUrlManager}/review-order/${id}`;
    return this.http.get<CombinedResponse>(url);
  }

  // Crear envío
  createDelivery(delivery: Delivery): Observable<Delivery> {
    return this.http.post<Delivery>(`${this.baseUrlOperator}/create-order`, delivery);
  }

  // Actualizar envío
  updateDelivery(id: number, delivery: any): Observable<any> {
    return this.http.put<void>(`${this.baseUrlOperator}/modify-order/${id}`, delivery);
  }

  // Eliminar envío
  deleteDelivery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrlOperator}/modify-order/${id}`);
  }

  // Cambiar estado de un envío en modo revisión (basado en status que se envía)
  updateDeliveryStatus(id: number, status: string, comments: string | null = null): Observable<Delivery> {
    const payload = { comments, status };
    const url = ['ready for departure', 'corrections needed'].includes(status)
    ? `${this.baseUrlManager}/review-order/${id}`
    : ['approved', 'not approved'].includes(status)
    ? `${this.baseUrlManager}/verify-order/${id}`
    : '';
    return this.http.put<Delivery>(url, payload);
  }
}


