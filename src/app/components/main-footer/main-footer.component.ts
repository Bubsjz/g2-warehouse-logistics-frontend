import { Component, OnInit } from '@angular/core';
import { HeadFooterService } from '../../services/head-footer.service';

@Component({
  selector: 'app-main-footer',
  standalone: true,
  imports: [],
  templateUrl: './main-footer.component.html',
  styleUrl: './main-footer.component.css'
})
export class MainFooterComponent implements OnInit {
  adminEmail: string = '';

  constructor(private userService: HeadFooterService) {}

  ngOnInit(): void {
      this.userService.getAdminEmail().subscribe({
        next: (data) => {
          this.adminEmail = data.email;
        },
        error: (err) => {
          console.error('Error fetching admin email:', err);
        },
      })
    }
}
