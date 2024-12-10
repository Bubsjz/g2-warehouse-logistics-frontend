import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/token.service';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css'
})
export class MainHeaderComponent implements OnInit {

  userRol: string = 'not found';
  userName: string = 'not found';
  userSurname: string = 'not found';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.userRol = this.authService.getUserRole() || 'not found';
    this.userName = this.authService.getUserName() || 'not found';
    this.userSurname = this.authService.getUserSurname() || 'not found';
    console.log(`User Data: Role=${this.userRol}, Name=${this.userName}, Surname=${this.userSurname}`);
  }

  logOut(): void {
    this.authService.logOut();
  }

}