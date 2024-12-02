import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, Warehouse, Truck, Product, DeliveryProduct } from '../interfaces/order.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}


  // Obtener envío por ID
  getDeliveryById(id: number, role: string): Observable<Delivery> {
    const url = role === 'operator'
      ? `${this.baseUrl}/operator/modify-order/${id}`
      : `${this.baseUrl}/manager/review-order/${id}`;
    return this.http.get<Delivery>(url);
  }

  // Relación entre envíos y productos
  getDeliveryProducts(id: number, role: string): Observable<DeliveryProduct[]> {
    const url = role === 'operator'
      ? `${this.baseUrl}/operator/modify-order/${id}`
      : `${this.baseUrl}/manager/review-order/${id}`;

    return this.http.get<DeliveryProduct[]>(url);
  }

  // Crear envío
  createDelivery(delivery: Delivery): Observable<Delivery> {
    return this.http.post<Delivery>(`${this.baseUrl}/create-order`, delivery);
  }

  // Actualizar envío
  updateDelivery(id: number, delivery: Delivery): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.baseUrl}/modify-order/${id}`, delivery);
  }

  // Eliminar envío
  deleteDelivery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/modify-order/${id}`);
  }

  // Cambiar estado de un envío
  updateDeliveryStatus(id: number, comments: string): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.baseUrl}/manager/review-order/${id}`, { comments });
  }

  // Actualizar comentarios de un envío
  updateDeliveryComments(id: number, comments: string): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.baseUrl}/manager/review-order/${id}`, { comments });
  }

// OBTENER DATOS FUNCIONAMIENTO FORMULARIO
  // Almacenes
  getWarehouses(role: string): Observable<Warehouse[]> {
    const url = role === 'operator'
      ? `${this.baseUrl}/operator/modify-order`
      : `${this.baseUrl}/manager/review-order`;

    return this.http.get<Warehouse[]>(url);
  }

  // Camiones
  getTrucks(role: string): Observable<Truck[]> {
    const url = role === 'operator'
      ? `${this.baseUrl}/operator/modify-order`
      : `${this.baseUrl}/manager/review-order`;

    return this.http.get<Truck[]>(url);
  }

  // Productos
  getProducts(role: string): Observable<Product[]> {
    const url = role === 'operator'
      ? `${this.baseUrl}/operator/modify-order`
      : `${this.baseUrl}/manager/review-order`;

    return this.http.get<Product[]>(url);
  }
  
}



