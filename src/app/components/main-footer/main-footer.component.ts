import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/token.service';


@Component({
  selector: 'app-main-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './main-footer.component.html',
  styleUrl: './main-footer.component.css'
})
export class MainFooterComponent implements OnInit {
  userRole!: string;
  adminEmail:String= "support@rountravel.com"

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole() || 'unknown';
  }

    logOutFooter(): void {
      this.authService.logOut();
    }
}

