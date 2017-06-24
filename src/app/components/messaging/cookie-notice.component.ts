import { Component, OnInit } from '@angular/core'
import * as _ from 'lodash'
import * as Cookies from 'js-cookie'

@Component({
  selector: 'app-cookie-notice',
  templateUrl: './cookie-notice.component.html'
})
export class CookieNoticeComponent implements OnInit {
  cookieSet = true
  constructor() { }

  ngOnInit() {
    this.cookieSet = (_.isUndefined(Cookies.get('cookie-notice'))) ? false : true
  }

  setCookie(event: any) {
    event.preventDefault()
    this.cookieSet = true
    Cookies.set('cookie-notice', 'True', { expires: 365 })
  }

}
