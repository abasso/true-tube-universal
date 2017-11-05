import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import { Auth } from './../../services/auth.service'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
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
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2
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
