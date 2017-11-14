import { PLATFORM_ID, Component, OnInit, Output, EventEmitter, Inject } from '@angular/core'
import { ListFilterComponent } from './../content/listing/filter.component'
import { ContentTypes } from './../../definitions/content-types'
import { ListService } from './../../services/list.service'
import { ItemComponent } from './../content/item/item.component'
import { Auth } from './../../services/auth.service'
import * as _ from 'lodash'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { AnalyticsService } from './../../services/analytics.service'

@Component({
  selector: 'app-primary-nav',
  templateUrl: './primary-nav.component.html'
})
export class PrimaryNavComponent implements OnInit {
  @Output() searchSubmitted = new EventEmitter()
  @Output() menuClick = new EventEmitter()
  //@Output() loginClick = new EventEmitter()
  public items: any[]
  public item: any = ItemComponent
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private filter: ListFilterComponent,
    private listService: ListService,
    public auth: Auth,
    public analyticsService: AnalyticsService
  ) {
    this.items = _.filter(ContentTypes, {inMenu: true})
  }

  ngOnInit() {
    this.item = ItemComponent
  }

  resetRootPath(event: any, query: any) {
    event.preventDefault()
    this.listService.resetCurrentPath(query)
    this.menuClick.emit(event)
  }

  logout(event: any) {
    this.auth.logout(event)
    this.menuClick.emit(event)
  }

  login(event: any) {
    this.auth.login(event)
    //this.loginClick.emit(event)
  }

  register(event: any) {
    event.preventDefault()
    this.auth.signup(event)
    this.menuClick.emit(event)
  }

  profile(event: any) {
    this.auth.logout(event)
    this.menuClick.emit(event)
  }

  searchDone(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsService.emitEvent("Primary Nav", "Search", event.target.elements[0].value)
    }
    this.searchSubmitted.emit(event)
  }

}
