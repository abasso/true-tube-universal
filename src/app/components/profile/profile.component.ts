import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {Profile} from './profile.model'
import {ActivatedRoute} from '@angular/router'
import * as _ from 'lodash'
import {AuthHttp} from 'angular2-jwt'
import { DataService } from './../../services/data.service'
import { Auth } from './../../services/auth.service'
import { Headers, RequestOptions } from '@angular/http'

@Component({
    templateUrl: './profile.component.html'
})
export class ProfileComponent {
    @ViewChild('fileInput') inputEl: ElementRef
    public profile: Profile
    public showNotification = false
    public notificationMessage: string
    public rmUnifyUser = false
    public notificationEmail = false
    public embedButtonLabel = 'Copy'
    public embedButtonClass = 'btn-video'
    public showAccessCode = false
    public lists: any[] = []
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
      private http: AuthHttp,
      private route: ActivatedRoute,
      public auth: Auth,
      private dataService: DataService

    ) {
        route.data.subscribe(data => {
            this.profile = data['profile']
            if (this.profile.userMetaData) {
              if (this.profile.userMetaData.memberType === 'teacher' || this.profile.userMetaData.memberType === 'other') {
                this.showAccessCode = true
              }
            }
        })
    }

    setName(event: any) {
      this.profile.name = event.target.value
    }

    passwordReminder() {
      let header = new Headers()
      header.append('Content-Type', 'application/json')
      return this.http
      .post('https://truetube.eu.auth0.com/dbconnections/change_password', {
        'client_id': 'c1OIvYBFmOpdrUgXuHGD5j3KE7rjFSJT',
        'email': this.profile.email,
        'connection': 'Username-Password-Authentication'
      }, { headers: header })
      .subscribe((response) => {
        if (response['status'] === 200) {
          this.showNotification = true
          this.notificationMessage = 'Password change link sent'
          this.notificationEmail = true
          setTimeout(() => {
            this.showNotification = false
          }, 3000)
        }
      })
    }

    embedCopySuccess(event: any) {
      this.embedButtonLabel = 'Copied'
      this.embedButtonClass = 'btn-success'
      setTimeout(() => {
        this.embedButtonLabel = 'Copy'
        this.embedButtonClass = 'btn-video'
      }, 1000)
    }

    update() {
      let header = new Headers()
      header.append('Content-Type', 'application/json')
      return this.http
      .post('https://www.truetube.co.uk/v5/api/me', {
        nickname: this.profile.name
      }, { headers: header })
      .subscribe((response) => {
          this.showNotification = true
          this.notificationMessage = 'User details updated.'
          this.notificationEmail = true
          setTimeout(() => {
            this.showNotification = false
          }, 3000)
      })
    }
}
