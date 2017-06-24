import { Component, OnInit } from '@angular/core'
import { DataService } from './../../services/data.service'

@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html'
})
export class AwardsComponent implements OnInit {
  public items: any[]
  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.itemPages('footer_awards')
    .subscribe(
      (data) => {
        this.items = data._source.items
      }
    )
  }

}
