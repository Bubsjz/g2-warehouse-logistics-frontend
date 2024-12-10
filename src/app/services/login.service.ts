import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { iUser } from '../interfaces/user.interface';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

 
  private apiUrl = 'http://localhost:3000/login';
  

  constructor(private http: HttpClient) {}



login(email: string, password: string): Observable<{ message: string, token: string, role: iUser['role']  } | null> {
  const payload = { email, password };
  return this.http.post<{ message: string, token: string, role: iUser['role'] }>(this.apiUrl, payload).pipe(
    catchError(err => {
      console.error('Error during login:', err);
      return of(null);
    })
  );
}

}



