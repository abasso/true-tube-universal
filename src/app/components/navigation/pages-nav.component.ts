import { Component, OnInit } from '@angular/core'
import { DataService } from './../../services/data.service'
import { AnalyticsService } from './../../services/analytics.service'


@Component({
  selector: 'app-pages-nav',
  templateUrl: './pages-nav.component.html'
})
export class PagesNavComponent implements OnInit {
  public menu: any
  constructor(
    private dataService: DataService,
    public analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.dataService.menus()
    .subscribe((data) => {
      this.menu = data._source.items
    })
  }

}
