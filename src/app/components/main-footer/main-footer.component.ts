import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

type decodeToken = {
  user_name: string;
  user_surname: string;
  user_id: number;
  user_role: string;
  iat: number;
  exp: number;
}


@Component({
  selector: 'app-main-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-footer.component.html',
  styleUrl: './main-footer.component.css'
})
export class MainFooterComponent implements OnInit {
  UserRole!: string;
  adminEmail:String= "support@rountravel.com"

  

  ngOnInit(): void {

    const token = localStorage.getItem('authToken')
    if(token){
      const decoded = jwtDecode(token) as decodeToken
      this.UserRole = decoded.user_role
    }

     
  }
    logOutFooter(){
      localStorage.removeItem('authToken')
    }
}

