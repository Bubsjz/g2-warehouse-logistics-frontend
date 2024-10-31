import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { OrderTableComponent } from "./components/order-table/order-table.component";
import { OrderFormComponent } from './components/order-form/order-form.component';
import { WarehouseFormComponent } from './components/warehouse-form/warehouse-form.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { WarehouseViewComponent } from './pages/warehouse-view/warehouse-view.component';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,OrderTableComponent, LoginComponent, OrderFormComponent, WarehouseFormComponent, UserFormComponent, WarehouseViewComponent, MainHeaderComponent, MainFooterComponent, NavbarComponent],
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
