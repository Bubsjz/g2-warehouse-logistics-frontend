import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Delivery } from '../interfaces/delivery.interface';
import { lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  private baseUrl: string = environment.API_URL + "/operator"


  private httpClient = inject(HttpClient)

  getAllDeliveryByUser(){

   const prueba = lastValueFrom(this.httpClient.get<Delivery[]>(`${this.baseUrl}/order-list`)) 
    return prueba
  

  }

  getUserById(id_user:number){
    return lastValueFrom(this.httpClient.get<User[]>(`${this.baseUrl}/order-list/${id_user}`))
  }


}
