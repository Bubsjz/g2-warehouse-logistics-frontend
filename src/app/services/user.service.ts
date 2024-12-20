import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { iUser } from '../interfaces/user-view.interface';
import { iWarehouse } from '../interfaces/warehouse-user-view.interface';
import { environment } from '../../environments/environment';

import { inject} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApiUrl = environment.API_URL + '/users';
  private warehouseApiUrl = environment.API_URL + '/warehouses';

  constructor(private http: HttpClient) {}

  // VISTA USUARIO

    // Obtener usuario con almacén asociado
    getUserWithWarehouse(id_user: number): Observable<{ user: iUser; warehouse: iWarehouse }> {
      return this.http.get<iUser[]>(`${this.userApiUrl}?id_user=${id_user}`).pipe(
        switchMap((users) => {
          if (users.length === 0) {
            throw new Error('User not found');
          }
          const user = users[0];
          return this.http.get<iWarehouse[]>(`${this.warehouseApiUrl}?id_warehouse=${user.asigned_id_warehouse}`).pipe(
            map((warehouses) => {
              if (warehouses.length === 0) {
                throw new Error('Warehouse not found');
              }
              return { user, warehouse: warehouses[0] };
            })
          );
        })
      );
    }

    deleteUser(id_user: number): Observable<void> {
      const url = `${this.userApiUrl}/${id_user}`;
      return this.http.delete<void>(url);
    }



  }







 
 

 


