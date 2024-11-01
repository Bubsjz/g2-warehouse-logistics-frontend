import { Component } from '@angular/core';
import { PaginatorComponent } from '../../components/paginator/paginator.component';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [PaginatorComponent],
  templateUrl: './order-table.component.html',
  styleUrl: './order-table.component.css'
})
export class OrderTableComponent {

}
