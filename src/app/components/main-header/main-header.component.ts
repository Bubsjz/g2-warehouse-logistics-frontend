import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

type decodeToken = {
  user_name: string;
  user_surname: string;
  user_id: number;
  user_role: string;
  user_image: File;
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
  userImage!: string | null
  
  ngOnInit(): void {
      const token = localStorage.getItem('authToken')
      if(token){
        const decoded = jwtDecode(token) as decodeToken
        console.log('Decoded Token:', decoded)
        this.userRol = decoded.user_role
        this.userName = decoded.user_name;
        this.userSurname = decoded.user_surname
        if (decoded.user_image) {
           this.userImage = `http://localhost:3000/uploads/${decoded.user_image}`
        } else {
          this.userImage = null;
        }
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