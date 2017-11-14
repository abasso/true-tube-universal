import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import { Auth } from './../../services/auth.service'
import { AnalyticsService } from './../../services/analytics.service'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  public menuVisible = false
  public showLogin: Boolean = false
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public auth: Auth,
    public analyticsService: AnalyticsService
  ) {
  }
  ngOnInit() {
  }
  toggleMenu(event: any) {
    event.preventDefault()
    this.menuVisible = (this.menuVisible === false) ? true : false
  }
  mobileSearch(event: any) {
    event.preventDefault()
    this.menuVisible = true
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('search').focus()
    }
  }
  searchDone(event: any) {
    this.hideMenu()
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('search').blur()
    }
  }

  menuClick() {
    this.hideMenu()
  }

  openLogin() {
    this.showLogin = true
  }

  hideMenu() {
    this.menuVisible = false
  }

}
