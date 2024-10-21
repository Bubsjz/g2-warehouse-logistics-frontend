import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderTableComponent } from "./components/order-table/order-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OrderTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'g2-warehouse-logistics-frontend';
}
