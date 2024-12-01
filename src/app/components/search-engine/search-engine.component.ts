import { Component } from '@angular/core';

@Component({
  selector: 'app-search-engine',
  standalone: true,
  imports: [],
  templateUrl: './search-engine.component.html',
  styleUrl: './search-engine.component.css'
})
export class SearchEngineComponent {
  // @Output() busquedaEmitida: EventEmitter<string> = new EventEmitter()

  // search(event: Event) {
  //   let input = event.target as HTMLInputElement;
  //   let word = input.value
  //   this.busquedaEmitida.emit(word)

}
