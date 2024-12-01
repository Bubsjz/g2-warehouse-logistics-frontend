import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery, Warehouse, Truck, Product, DeliveryProduct } from '../interfaces/order.interfaces';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  private baseUrl = 'http://localhost:3000';

  // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MiwidXNlcl9yb2xlIjoib3BlcmF0b3IiLCJpYXQiOjE3MzI3MDMzNTUsImV4cCI6MTczMjcwNjk1NX0.3aigGKi79y2yCvmldL_ge3v5zLtUHwKsP2521Y7yMMo

  constructor(private http: HttpClient) {}

// !!!! MODIFICAR RUTAS PARA AÑADIR VARIABLE EN FUNCIÓN DE ROL EXTRAIDO DE CABECERAS (O PETICIONAR VÍA TOKEN)
// !!!! ADAPTAR TAMBIÉN LAS URLS A LA RUTA DE PETICIÓN (SIMILARES A LAS RUTAS DE LA APLICACIÓN)
/* //getOrderById (role, id) {
const url = role === "operator" ? </operator/modify-order/${id}> : </manager/review-order/${id)
  return this.http.get(url) */

  //cambiar ready departure por ready for departure



  // Obtener envío por ID
  getDeliveryById(id: number): Observable<Delivery> {
    const url = `${this.baseUrl}/delivery/${id}`;
    console.log(Response);
    return this.http.get<Delivery>(url);
  }

  // Relación entre envíos y productos
  getDeliveryProducts(): Observable<DeliveryProduct[]> {
    return this.http.get<DeliveryProduct[]>(`${this.baseUrl}/delivery_products`);
  }

  // Crear envío
  createDelivery(delivery: any): Observable<any> {
    console.log('Data received by createDelivery:', delivery);
    return this.http.post<Delivery>(`${this.baseUrl}/delivery`, delivery);
  }

  // Actualizar envío
  updateDelivery(id: number, delivery: any): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.baseUrl}/delivery/${id}`, delivery);
  }

  // Eliminar envío
  deleteDelivery(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delivery/${id}`);
  }

  // Cambiar estado de un envío
  updateDeliveryStatus(id: number, status: string): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.baseUrl}/delivery/${id}`, { status });
  }

  // Actualizar comentarios de un envío
  updateDeliveryComments(id: number, comments: string): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.baseUrl}/delivery/${id}`, { comments });
  }

// OBTENER DATOS FUNCIONAMIENTO FORMULARIO
  // Almacenes
  getWarehouses(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.baseUrl}/warehouse`);
  }

  // Camiones
  getTrucks(): Observable<Truck[]> {
    return this.http.get<Truck[]>(`${this.baseUrl}/truck`);
  }

  // Productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/product`);
  }
  
}



