import { Injectable } from '@angular/core';
import { Iuser } from '../interfaces/iuser.interface';
import { USERS } from '../db/users.db';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private arrUsers: Iuser[] = USERS;
}
