import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { WarehouseCardComponent } from "./pages/warehouse-card/warehouse-card.component";
import { WarehouseUserListComponent } from "./pages/warehouse-user-list/warehouse-user-list.component";
import { WarehouseViewComponent } from "./pages/warehouse-view/warehouse-view.component";
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, WarehouseCardComponent, WarehouseUserListComponent, WarehouseViewComponent, MainHeaderComponent, MainFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'g2-warehouse-logistics-frontend';

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.sendPage();
      }
  sendPage(currentPage:string = "1"){
    console.log(currentPage);
  }

}
