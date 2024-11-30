import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Delivery } from '../interfaces/delivery.interface';
import { lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  //private baseUrl: string = "http://localhost:3000/operator"
  private baseUrl:string = 'https://4415-79-157-9-69.ngrok-free.app/operator'

  private httpClient = inject(HttpClient)

  getAllDeliveryByUser(){

   const prueba = lastValueFrom(this.httpClient.get<Delivery[]>(`${this.baseUrl}/order-list`)) 
    return prueba
  

  }

  getUserById(id_user:number){
    return lastValueFrom(this.httpClient.get<User[]>(`${this.baseUrl}/order-list/${id_user}`))
  }


}
