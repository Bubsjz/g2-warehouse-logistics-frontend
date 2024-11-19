import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { iUser } from '../user.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<{ rol: iUser['rol'] } | null> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(user => user.email === email && user.password === password);
        return user ? { rol: user.rol } : null;
      })
    );
  }
}