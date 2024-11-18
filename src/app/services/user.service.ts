import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = 'http://localhost:3001/user'
  private httpClient = inject(HttpClient);



  getAll(){
   return lastValueFrom(this.httpClient.get<User[]>(this.baseUrl));
  }

  getById(id_user:number){
    return lastValueFrom(this.httpClient.get<User[]>(`${this.baseUrl}?id_user=${id_user}`))
  }

}
