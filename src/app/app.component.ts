import { Component, ViewEncapsulation, OnInit } from '@angular/core'
import { TransferState } from '../modules/transfer-state/transfer-state'
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga/angulartics2-ga'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,

})
export class AppComponent implements OnInit {
  constructor(
    private cache: TransferState,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics
  ) {}
  ngOnInit() {
    this.cache.set('cached', true);
  }
}
