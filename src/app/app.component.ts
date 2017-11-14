import { Component, ViewEncapsulation, OnInit } from '@angular/core'
import { TransferState } from '../modules/transfer-state/transfer-state'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
  './../styles.scss'
  ],
})
export class AppComponent implements OnInit {
  constructor(
    private cache: TransferState,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });
  }
  ngOnInit() {
    this.cache.set('cached', true);
  }
}
