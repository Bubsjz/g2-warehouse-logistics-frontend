import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Delivery } from '../interfaces/deliveri.interface';

@Injectable({
  providedIn: 'root'
})
export class DeliveriService {
  private apiUrl:string = 'http://localhost:3000/Deliveries'
  private httpClient = inject(HttpClient)

  getAll(){
    return lastValueFrom(this.httpClient.get<Delivery[]>(this.apiUrl))
  }

  getById(deliveryId:number){
    return lastValueFrom(this.httpClient.get<Delivery[]>(`${this.apiUrl}?id_delivery=${deliveryId}`))
  }
  
 
}
