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
  selector: 'app-main-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css'
})
export class MainHeaderComponent implements OnInit {
  userRol!: string;
  userName!: string;
  userSurname!:string;
  
  ngOnInit(): void {
      const token = localStorage.getItem('authToken')
      if(token){
        const decoded = jwtDecode(token) as decodeToken
        console.log(decoded.user_surname)
        this.userRol = decoded.user_role
        this.userName = decoded.user_name;
        this.userSurname = decoded.user_surname
        
      }else{
        this.userRol = "not found"
        this.userName = "not found"
        this.userSurname = "not found"
      }
      
    }



    logOut(){
      localStorage.removeItem('authToken')
     
    }
  }