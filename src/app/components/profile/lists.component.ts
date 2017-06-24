import {Component} from '@angular/core'
import {Profile} from './profile.model'
import * as _ from 'lodash'
import {AuthHttp} from 'angular2-jwt'
import { ActivatedRoute, Router } from '@angular/router'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html'
})
export class UserListsComponent {
  public deleteDialogTitle = 'Delete this list?'
  public message = ''
  public confirmClicked = false
  public cancelClicked = false
  public profile: Profile
  public lockBlur = false
  public lists: any[] = []
  public notificationMessage = ''
  public showNotification = false
  public notificationRemove = false
  public menu: any[] = [
    {
      label: 'Profile',
      url: '/me',
      css: ''
    },
    {
      label: 'Lists',
      url: '/me/lists',
      css: 'icon icon-small icon-list icon-left'
    },
    {
      label: 'Favourites',
      url: '/me/list/favourites',
      css: 'icon icon-small icon-favourite icon-left'
    }
  ]
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public http: AuthHttp,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2

  ) {
      route.data.subscribe(data => {
          this.profile = data['profile']
          _.each(this.profile.lists, (list, key) => {
            let listObject = {
              key: key,
              title: list['title'],
              titleWithCount: list['title'] + ' (' + list['items'].length + ' Item' + ((list['items'].length > 1) ? 's' : '') + ')',
              canDelete: true,
              url: '/me/list/' + key
            }
            if (key.toString() === 'favourites') {
              listObject.canDelete = false
              this.lists.unshift(listObject)
            } else {
              this.lists.push(listObject)
            }
          })
      })
  }

  toggleNotification(list: string) {
    this.notificationRemove = true
    this.notificationMessage = 'Removed ' + list
    this.showNotification = true
    setTimeout(() => {
      this.showNotification = false
    }, 3000)
  }

  highlightRow(event: any, list: string) {
    event.preventDefault()
    _.each(this.lists, (item) => {
      if (item.title === list) {
        item.removing = true
      }
    })
  }

  unHighlightRow(list: string) {
    _.each(this.lists, (item) => {
      if (item.title === list) {
        item.removing = false
      }
    })
  }

  navigate(event: any) {
    this.router.navigateByUrl(event)
  }

  removeList(event: any, key: string) {
    this.http.delete('https://www.truetube.co.uk/v5/api/me/' + key).subscribe(
    (data) => {
      _.each(this.lists, (item) => {
        if (item.key === key) {
          item.removed = true
          this.toggleNotification(item.title)
        }
      })
      setTimeout(() => {
         _.remove(this.lists, {'key': key})
       }, 200)
    })
  }
}
