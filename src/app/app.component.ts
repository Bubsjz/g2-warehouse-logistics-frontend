import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WarehouseCardComponent } from "./pages/warehouse-card/warehouse-card.component";
import { WarehouseUserListComponent } from "./pages/warehouse-user-list/warehouse-user-list.component";
import { WarehouseViewComponent } from "./pages/warehouse-view/warehouse-view.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WarehouseCardComponent, WarehouseUserListComponent, WarehouseViewComponent],
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
