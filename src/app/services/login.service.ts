import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { iUser } from '../interfaces/user.interface';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Funcionamiento con backend

/*   private baseUrl: string = `${environment.API_URL}`

  private httpClient = inject(HttpClient);

  login(body: {email: string, password: string}): Promise<iUser> {
    return lastValueFrom(
      this.httpClient.post<iUser>(`${this.baseUrl}/users`, body)
    );
  } */



  // Funcionamiento con json-server
  /* private apiUrl = 'http://localhost:3000/users'; */
  private apiUrl = 'https://7780-79-157-9-69.ngrok-free.app/login';

  constructor(private http: HttpClient) {}

/*   login(email: string, password: string): Observable<{ rol: iUser['rol'] } | null> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        const user = users.find(user => user.email === email && user.password === password);
        return user ? { rol: user.rol } : null;
      })
    );
  } */

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



