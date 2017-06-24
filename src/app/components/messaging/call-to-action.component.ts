import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import * as Cookies from 'js-cookie'
import * as _ from 'lodash'
import { Auth } from './../../services/auth.service'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

@Component({
  selector: 'app-call-to-action',
  templateUrl: './call-to-action.component.html'
})
export class CallToActionComponent implements OnInit {
  private fontSize = 16
  public dyslexiaEnabled = false
  public dyslexiaLabel = 'Dyslexia Font'
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public auth: Auth,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2
  ) { }

  ngOnInit() {
    if (Cookies.get('dyslexia-font')) {
      this.setDyslexiaFont()
      this.dyslexiaEnabled = true
      this.dyslexiaLabel = 'Standard Font'
    }
  }

  toggleDyslexiaFont(event: any) {
    this.dyslexiaEnabled = (this.dyslexiaEnabled) ? false : true
    this.dyslexiaLabel = (this.dyslexiaEnabled) ? 'Standard Font' : 'Dyslexia Font'
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Dyslexia Font', label: this.dyslexiaLabel}})
    }
    event.preventDefault()
    this.setDyslexiaFont()
    this.setDyslexiaCookie()
  }

  setDyslexiaCookie() {
    if (_.isUndefined(Cookies.get('dyslexia-font'))) {
      Cookies.set('dyslexia-font', 'true')
    } else {
      Cookies.remove('dyslexia-font')
    }
  }

  toggleSite(event: any) {
    event.preventDefault()
    Cookies.set('proxy_override', 'true')
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload()
    }
  }

  setDyslexiaFont() {
    if (isPlatformBrowser(this.platformId)) {
      let body: any = document.getElementsByTagName('body')[0]
      let className = 'dyslexia'
      if (body.classList) {
        body.classList.toggle(className)
      } else {
        let classes: any = body.className.split(' ')
        let existingIndex: any = classes.indexOf(className)
        if (existingIndex >= 0) {
          classes.splice(existingIndex, 1)
        } else {
          classes.push(className)
        body.className = classes.join(' ')
        }
      }
    }
  }
}
