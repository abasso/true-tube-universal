import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import { DataService } from './../../../services/data.service'
import { ActivatedRoute } from '@angular/router'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import * as _ from 'lodash'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

@Component({
  selector: 'app-item-page',
  templateUrl: './item-page.component.html'
})
export class ItemPageComponent implements OnInit {
  public content: any[] = []
  public param: any
  public currentId: string
  public gridSize = 'grid-row'
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private dataService: DataService,
    private route: ActivatedRoute,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2
  ) {
  }
  ngOnInit() {
    this.param = this.route.url.subscribe(
      (url) => {
        this.currentId = url[url.length - 1].path

      this.dataService.itemPages(this.currentId)
      .subscribe(
        (data) => {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0)
        }
          if (data._source.grid_size !== 3) {
            this.gridSize = (data._source.grid_size === 4) ? 'grid-row-four' : (data._source.grid_size === 2) ? 'grid-row-two' : 'list-row'
          }
          this.content.push(data._source)
          _.each(this.content, (content) => {
            _.each(content.items, (item) => {
              if (item.link) {
                item.cleanLink = item.link.split('/')[2]
              }
            })
          })
        }
      )
    }
  )
}
}
