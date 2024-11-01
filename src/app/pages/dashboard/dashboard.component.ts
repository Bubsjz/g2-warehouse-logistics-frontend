import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainHeaderComponent } from "../../components/main-header/main-header.component";
import { MainFooterComponent } from "../../components/main-footer/main-footer.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, MainHeaderComponent, MainFooterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
