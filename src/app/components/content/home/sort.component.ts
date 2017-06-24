import { PLATFORM_ID, Component, Inject } from '@angular/core'
import { HomeListingComponent } from './list.component'
import { DataService } from './../../../services/data.service'
import { Categories } from './../../../definitions/categories'
import * as Cookies from 'js-cookie'
import * as _ from 'lodash'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

@Component({
  selector: 'home-sort',
  templateUrl: './sort.component.html'
})
export class HomeSortComponent {

  public pages: number[]
  public itemsPerPageCurrent: any
  public currentPage: number
  public loadMoreCount: number
  public categories: any[] = Categories
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public ListingComponent: HomeListingComponent,
    public dataService: DataService,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2
  ) {
    this.setListDisplay((_.isUndefined(Cookies.get('list-display'))) ? 'grid' : Cookies.get('list-display'))
    this.currentPage = 0
    this.ListingComponent.paginationData.itemsPerPageCurrent = 12
    this.ListingComponent.paginationData.pages = []
    this.ListingComponent.paginationData.totalPages = Math.ceil(this.ListingComponent.paginationData.totalItems / this.ListingComponent.paginationData.itemsPerPageCurrent)
    for ( let i = 0; i < this.ListingComponent.paginationData.totalPages; i++ ) {
      this.ListingComponent.paginationData.pages.push(i + 1)
    }
    this.pages = this.ListingComponent.paginationData.pages
    this.loadMoreCount = 12
    this.ListingComponent.paginationData.currentPage = this.currentPage
  }

  setListDisplay(type: string) {
    Cookies.set('list-display', type)
    this.ListingComponent.displayGrid = (type === 'grid') ? true : false
    this.ListingComponent.displayList = (type === 'list') ? true : false
  }

  listDisplayClick(event: any, type: string) {
    event.preventDefault()
    this.setListDisplay(type)
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Set List Type', label: type}})
    }
  }
}
