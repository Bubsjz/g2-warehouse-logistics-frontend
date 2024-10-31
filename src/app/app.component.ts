import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderTableComponent } from "./components/order-table/order-table.component";

import { LoginComponent } from './components/login/login.component';
import { OrderFormComponent } from './components/order-form/order-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, OrderTableComponent],
  imports: [RouterOutlet, LoginComponent, OrderFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'g2-warehouse-logistics-frontend';

  ngOnInit(): void {
    this.sendPage();
      }
  sendPage(currentPage:string = "1"){
    console.log(currentPage);
  }

}
