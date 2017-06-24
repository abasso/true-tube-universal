import { Component, OnInit } from '@angular/core'
import { DataService } from './../../services/data.service'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'

@Component({
  selector: 'app-pages-nav',
  templateUrl: './pages-nav.component.html'
})
export class PagesNavComponent implements OnInit {
  public menu: any
  constructor(
    private dataService: DataService,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2
  ) { }

  ngOnInit() {
    this.dataService.menus()
    .subscribe((data) => {
      this.menu = data._source.items
    })
  }

}
