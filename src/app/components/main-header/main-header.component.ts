import { Component, OnInit } from '@angular/core';
import { HeadFooterService } from '../../services/head-footer.service';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css'
})
export class MainHeaderComponent implements OnInit {
  userRol: string = '';
  userName: string = '';

  constructor(private userService: HeadFooterService) {}

  ngOnInit(): void {
      this.userService.getUserInfo().subscribe({
        next: (data) => {
          this.userName = data.name;
          this.userRol = data.rol;
        },
        error: (err) => {
          console.error('Error fetching user info:', err);
        },
      })
    }
  }