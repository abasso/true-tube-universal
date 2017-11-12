import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import * as moment from 'moment'
import { Angulartics2 } from 'angulartics2'

import * as Cookies from 'js-cookie'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  public currentYear: number = moment().year()

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    
    private angulartics2: Angulartics2
  ) { }

  ngOnInit() {
  }

  toggleSite(event: any) {
    Cookies.set('proxy_override', 'true')
    if (isPlatformBrowser(this.platformId)) {
      window.location.reload()
    }
  }

}
