import { Component, OnInit } from '@angular/core';
import { DataService } from './../../services/data.service'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import * as _ from 'lodash'

@Component({
  selector: 'app-footer-nav',
  templateUrl: './footer-nav.component.html'
})
export class FooterNavComponent implements OnInit {
  private menuData: any
  public menu: any
  private pages: any
  private items: any[] = []
  constructor(
    private dataService: DataService,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2
  ) { }

  ngOnInit() {

    this.menuData = this.dataService.menus().subscribe(
      (data) => {
        _.each(data._source.items, (item) => {
          item.slug = item.uri
        })
        this.menu = data._source.items
        this.menu = _.chunk(this.menu, 5)
      }
    )
  }
}
