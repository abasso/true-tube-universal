import {Component} from '@angular/core'
import {Profile} from './profile.model'
import { ActivatedRoute, Router, Params } from '@angular/router'
import { DataService } from './../../services/data.service'
import {AuthHttp} from 'angular2-jwt'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'

import * as _ from 'lodash'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html'
})
export class UserListComponent {
  private data: any
  public profile: Profile
  public lists: any[] = []
  public items: any[] = []
  public title: string
  public id: any
  public deleteDialogTitle: string
  public message = ''
  public notificationMessage = ''
  public showNotification = false
  public notificationRemove = false
  public embeddedContent: any[] = []
  constructor(
    public route: ActivatedRoute,
    private dataService: DataService,
    public http: AuthHttp,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2
  ) {
    this.data = this.route.params
    .switchMap((params: Params) => this.dataService.userList(params['id']))
    .subscribe(
      (data) => {
        this.data = data
        this.items = data.items
        this.route.params
        .map(params => params['id'])
        .subscribe((id) => {
          this.id = id
          this.deleteDialogTitle = 'Remove from ' + data.title + '?'
          this.title = data.title + ' (' + this.items.length + ' Item' + ((this.items.length > 1) ? 's' : '') + ')'
        })
        _.each(this.items, (item) => {
          item.contenttypes = []
          _.each(item.resource_types, (resource) => {
            item.contenttypes.push({'label': resource.label, 'class': 'btn-' + resource.type.replace('_', '-'), 'query': { 'tab': resource.type}, 'slug': item.slug + '?tab=' + resource.type})
          })
        })
      }
    )

  }

  toggleNotification(item: string) {
    this.notificationRemove = true
    this.notificationMessage = 'Removed ' + item
    this.showNotification = true
    setTimeout(() => {
      this.showNotification = false
    }, 3000)
  }

  highlightRow(event: any, list: string) {
    event.preventDefault()
    _.each(this.items, (item) => {
      if (item.title === list) {
        item.removing = true
      }
    })
  }

  unHighlightRow(list: string) {
    _.each(this.items, (item) => {
      if (item.title === list) {
        item.removing = false
      }
    })
  }

  removeItem(event: any, key: string) {
    this.http.delete('https://www.truetube.co.uk/v5/api/me/' + this.id + '/' + key).subscribe(
    (data) => {
      _.each(this.items, (item) => {
        if (item.id === key) {
          item.removed = true
          this.toggleNotification(item.title)
        }
      })
      setTimeout(() => {
         _.remove(this.items, {'id': key})
         this.title = this.data.title + ' (' + this.items.length + ' Item' + ((this.items.length > 1) ? 's' : '') + ')'
       }, 200)
    })
  }
}
