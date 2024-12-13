import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';
import { lastValueFrom } from 'rxjs';
import { Delivery } from '../interfaces/delivery.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private baseUrl: string = environment.API_URL + "/manager"
 
  private httpClient = inject(HttpClient)

  getManagerById(id:number){
    return lastValueFrom(this.httpClient.get<User[]>(`${this.baseUrl}/${id}`))
  
  }

  getEntryOrders(){
    return lastValueFrom(this.httpClient.get<Delivery[]>(`${this.baseUrl}/incoming-orders`))
  }

  getOutputOrders(){
    return lastValueFrom(this.httpClient.get<Delivery[]>(`${this.baseUrl}/outgoing-orders`))
  }

  
}
