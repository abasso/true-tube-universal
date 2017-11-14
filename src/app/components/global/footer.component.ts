import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import * as moment from 'moment'
import * as Cookies from 'js-cookie'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { AnalyticsService } from './../../services/analytics.service'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

  public currentYear: number = moment().year()

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public analyticsService: AnalyticsService
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
