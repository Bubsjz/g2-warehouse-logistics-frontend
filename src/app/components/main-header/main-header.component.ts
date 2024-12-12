import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/token.service';
import { environment } from '../../../environments/environment';

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
  
  private mainUrl = environment.API_URL + '/uploads'

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
      const token = this.authService.getTokenData();
      if(token){
        this.userRol = token.user_role;
        this.userName = token.user_name;
        this.userSurname = token.user_surname;
        this.userImage = token.user_image 
        ? `${this.mainUrl}/${token.user_image}`
        : null;
      }else{
        this.userRol = 'not found';
        this.userName = 'not found';
        this.userSurname = 'not found';
        this.userImage = null;
      }
      
    }

    logOut(): void {
      this.authService.logOut();    
    }
  }