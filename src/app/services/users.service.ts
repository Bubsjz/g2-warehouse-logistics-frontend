import { inject, Injectable } from '@angular/core';
import { Iuser3, Iuser4 } from '../interfaces/iuser.interface';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Itruck } from '../interfaces/itruck.interface';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  private baseUrl: string = "http://localhost:3000/boss";
  private httpClient = inject(HttpClient);

  getAll(): Promise<Iuser3[]> {
    return lastValueFrom(this.httpClient.get<Iuser3[]>(`${this.baseUrl}/users`))
  }

  getById(id: number): Promise<Iuser4> {
    return lastValueFrom(this.httpClient.get<Iuser4>(`${this.baseUrl}/users/${id}`))
  }

  insert(body: FormData): Promise<Iuser3> {
    console.log('body', body)
    return lastValueFrom(this.httpClient.post<Iuser3>(`${this.baseUrl}/register`, body))
  }

  update(id: number, body: FormData): Promise<Iuser3> {
    // const body = {
    //   name: user.name, surname: user.surname, email: user.email, 
    //   password: user.password, role: user.role, image: user.image, 
    //   assigned_id_warehouse: user.assigned_id_warehouse, assigned_id_truck: user.assigned_id_truck
    // }
    return lastValueFrom(this.httpClient.put<Iuser3>(`${this.baseUrl}/users/${id}`, body))
  }

  deleteByID(id: number): Promise<Iuser3> {
    return lastValueFrom(this.httpClient.delete<Iuser3>(`${this.baseUrl}/users/${id}`))
  }

  getAvailableTrucks(): Promise<Itruck[]> {
    return lastValueFrom(this.httpClient.get<Itruck[]>(`${this.baseUrl}/available-trucks`))
  }
}
