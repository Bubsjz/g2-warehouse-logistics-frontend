import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainFooterComponent } from './components/main-footer/main-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainFooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'g2-warehouse-logistics-frontend';
}
