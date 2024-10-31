import { Component, Output, EventEmitter, Input} from '@angular/core';


@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css'
})
export class PaginatorComponent {
  @Output () page = new EventEmitter<string>()
  @Input() totalPages!: number;
  
  pages:string[]=[];
  currentPage:number = 1
  
  ngOnInit(){
   this.updatePages()
  }


  sendPage(page:string){
    if (page === "..."){

    }else{
      this.currentPage = Number(page);
      this.page.emit(page);
      this.updatePages();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.sendPage(this.currentPage.toString());
    }
  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.sendPage(this.currentPage.toString());
    }
  }
  updatePages() {
    this.pages = [];
    if (this.totalPages <= 5) {
      // Si hay 5 páginas o menos, muestra todas las páginas
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i.toString());
      }
    } else {
      // Si hay más de 5 páginas
      if (this.currentPage <= 3) {
        // Mostrar las primeras 5 páginas y luego '...' y la última página
        this.pages = ["1", "2", "3", "4", "5", '...', this.totalPages.toString()];
      } else if (this.currentPage >= this.totalPages - 3) {
        // Mostrar '1', '...', y las últimas 5 páginas
        this.pages = ["1", '...', (this.totalPages - 4).toString(), (this.totalPages - 3).toString(), (this.totalPages - 2).toString(), (this.totalPages - 1).toString(), this.totalPages.toString()];
      } else {
        // Mostrar '1', '...', página actual - 1, página actual, página actual + 1, '...', última página
       this.pages = ["1", '...', (this.currentPage - 1).toString(), this.currentPage.toString(), (this.currentPage + 1).toString(), '...', this.totalPages.toString()];
      }
    }
  }
  }


  


