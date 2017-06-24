import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent {
  @Output() searchSubmitted = new EventEmitter()
  @ViewChild('input') input: ElementRef
  private searchText = ''
  private focussed = false
  constructor(
    private router: Router
  ) {}

  focus() {
    this.focussed = true
  }

  blur() {
    if (this.searchText === '') {
      this.focussed = false
    }
  }

  populateText(event: any) {
    this.searchText = event.target.value
  }

  emptyCheck(event: any) {
    if (this.searchText === '') {
      event.preventDefault()
      this.input.nativeElement.focus()
    }
  }

  search(event: any) {
    this.searchSubmitted.emit(event)
    this.router.navigateByUrl('/list?search=' + event.target.elements[0].value)
  }

}
