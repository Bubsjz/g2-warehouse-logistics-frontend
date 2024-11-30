import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { iUser } from '../interfaces/user.interface';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

 
  //private apiUrl = 'http://localhost:3000/login';
  private apiUrl = "https://4415-79-157-9-69.ngrok-free.app/login"

  constructor(private http: HttpClient) {}



login(email: string, password: string): Observable<{ message: string, token: string, role: iUser['role']  } | null> {
  const payload = { email, password }; // Datos enviados al backend
  return this.http.post<{ message: string, token: string, role: iUser['role'] }>(this.apiUrl, payload).pipe(
    catchError(err => {
      console.error('Error during login:', err); // Registra errores en consola
      return of(null); // Devuelve null en caso de error
    })
  );
}

}



