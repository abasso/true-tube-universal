import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {Profile} from './profile.model'
import {ActivatedRoute} from '@angular/router'
import * as _ from 'lodash'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
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
        })
    }

    setName(event: any) {
      this.profile.name = event.target.value
    }

    passwordReminder() {
      let userProfile = JSON.parse(localStorage.getItem('profile'))
      let header = new Headers()
      header.append('Content-Type', 'application/json')
      return this.http
      .post('https://truetube.eu.auth0.com/dbconnections/change_password', {
        'client_id': 'c1OIvYBFmOpdrUgXuHGD5j3KE7rjFSJT',
        'email': userProfile['email'],
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
