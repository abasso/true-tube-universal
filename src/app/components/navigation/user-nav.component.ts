import { Component, OnInit } from '@angular/core'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import {ActivatedRoute, Router} from '@angular/router'
import * as _ from 'lodash'

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
})
export class UserNavComponent implements OnInit {
  public menu: any[] = [
    {
      label: 'Profile',
      url: '/me',
      css: '',
      selected: false
    },
    {
      label: 'Lists',
      url: '/me/lists',
      css: 'icon icon-small icon-list icon-left',
      selected: false
    },
    {
      label: 'Favourites',
      url: '/me/list/favourites',
      css: 'icon icon-small icon-favourite icon-left',
      selected: false
    }
  ]
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2
  ) {

   }

  ngOnInit() {
    this.route.url.subscribe(
      (url) => {
        if(url.length > 1) {
          _.each(this.menu, (menuItem) => {
            if(menuItem.label === _.capitalize(url[1].path)) {
              menuItem.selected = true
            }
          })
        } else {
          this.menu[0].selected = true
        }
      })
  }

  navigate(event: any) {
    this.router.navigateByUrl(event)
  }

}
