import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeadFooterService {
  private apiUrl: string = 'http://localhost:3000/users/1';
  
  constructor(private http: HttpClient) {}

  getUserInfo(): Observable<{ name: string; rol: string }> {
    return this.http.get<{ name: string; rol: string }>(this.apiUrl);
  };


  getAdminEmail(): Observable<{ email: string }> {
    const url = 'http://localhost:3000/users?rol=administrator';
    return this.http.get<{ email: string }[]>(url).pipe(
      map(users => users.length > 0 ? { email: users[0].email } : { email: 'No admin found' })
    );
  }
}