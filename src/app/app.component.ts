import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MainHeaderComponent } from './components/main-header/main-header.component';
import { MainFooterComponent } from './components/main-footer/main-footer.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MainHeaderComponent, MainFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'g2-warehouse-logistics-frontend';

  constructor(public router: Router) {}

/*   ngOnInit(): void {
    this.sendPage();
      }
  sendPage(currentPage:string = "1"){
  } */

}
