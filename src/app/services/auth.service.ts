import { PLATFORM_ID, Injectable, Inject } from '@angular/core'
import { tokenNotExpired } from 'angular2-jwt'
import {AuthHttp, AuthConfig} from 'angular2-jwt'
import {Http, RequestOptions} from '@angular/http'
import { myConfig } from './auth.config'
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router'
import { ActivatedRoute, Router } from '@angular/router'
import { Subject } from 'rxjs/Subject'
declare let ga: Function
import * as _ from 'lodash'
import * as moment from 'moment'

import { isPlatformBrowser, isPlatformServer } from '@angular/common'

declare let Auth0Lock: any
declare let auth0: any

@Injectable()
export class Auth {
  // Configure Auth0
  public lock
  public auth0
  public auth0Manage
  public userProfile: any
  public loggedInStatus: any = new Subject()
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if(localStorage.getItem('token') === 'undefined') localStorage.removeItem('token')
      let token = localStorage.getItem('token')
      this.lock = new Auth0Lock(
        myConfig.clientID,
        myConfig.domain,
        myConfig.options
      )
      this.auth0 = new auth0.WebAuth({
        domain: myConfig.domain,
        clientID: myConfig.clientID,
        redirectUri: 'http://' + window.location.host + '/',
        responseType: 'token id_token',
        audience: 'https://redefinitions.eu.auth0.com/userinfo',
        allowSignUp: false
      })
      if(this.authenticated()) {
        this.auth0Manage = new auth0.Management({
          domain: 'truetube.eu.auth0.com',
          token: token
        });
      }
      this.lock.on('authenticated', (authResult: any) => {
        console.log(authResult)
        if(authResult.error) return null;
        if(localStorage.getItem('token') === 'undefined') localStorage.removeItem('token')
        if(typeof localStorage.getItem('token') === 'undefined' || typeof localStorage.getItem('rmlogin') === 'undefined') return
        let redirectUrl: string = ''
        localStorage.setItem('token', authResult.idToken)
        redirectUrl = localStorage.getItem('redirectUrl')
        if(authResult.accessToken) {
          this.lock.getProfile(authResult.accessToken, (error: any, profile: any) => {
            if (error) {
              return console.log("THERE WAS AN ERROR GETTING THE USER DATA", error)
            }
            localStorage.setItem('profile', JSON.stringify(profile))
            this.userProfile = profile
            ga('set', 'userId', profile.user_id)
          })
        }

        this.loggedInStatus.next('update')
        if (redirectUrl) {
          this.router.navigate([redirectUrl])
        } else {
          this.router.navigate(['/me'])
        }
      })

      this.lock.on('hash_parsed', (authResult) => {
        // if(authResult.errorDescription === "Unknown or invalid login ticket.") {
        // }
      })

      this.lock.on('show', () => {
        let parent: any = document.querySelectorAll('.auth0-lock-body-content')
        parent[0].insertAdjacentHTML('beforebegin', '<div class="rm-unify-login"><a class="btn btn-rm-unify">Log In with <img src="/assets/images/logo_RM.png" /></a>or<div>')
        document.querySelectorAll('.btn-rm-unify')[0].addEventListener('click', (event) => {
          this.loginWithRM(event)
        })
      })
    }
  }

  public isAuthed(authResult: any) {
    let redirectUrl: string = ''
    if (isPlatformBrowser(this.platformId)) {
      if (authResult.error) return null;
      if (localStorage.getItem('token') === 'undefined' || localStorage.getItem('token') === 'null') localStorage.removeItem('token')
      if (authResult.id_token) localStorage.setItem('token', authResult.id_token)
      redirectUrl = localStorage.getItem('redirectUrl')
    }
    this.auth0.client.userInfo(authResult.access_token, (err, user) => {
      // Now you have the user's information
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('profile', JSON.stringify(user))
      }

      this.userProfile = user
      this.loggedInStatus.next('update')
      if (redirectUrl) {
        this.router.navigate([redirectUrl])
      } else {
        this.router.navigate(['/me'])
      }
      ga('set', 'userId', user.user_id)
    });
  }

  public login(event: any) {
    event.preventDefault()
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('redirectUrl', this.router.url)
      window.location.href = "http://truetube.eu.auth0.com/login?client=c1OIvYBFmOpdrUgXuHGD5j3KE7rjFSJT"
    }
  }

  public signup(event: any) {
    event.preventDefault()
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = "http://truetube.eu.auth0.com/login?client=c1OIvYBFmOpdrUgXuHGD5j3KE7rjFSJT&initialpage=signUp"
    }    
  }

  // public loginWithState(event: any, state: any) {
  //   event.preventDefault()
  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.setItem('redirectUrl', this.router.url + state)
  //   }
  //   this.lock.show()
  // }

  public loginWithRM(event: any) {
    event.preventDefault()
    // this.router.navigate(['/rm/callback'])
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = 'https://www.truetube.co.uk/rm/'
    }
  }

  public checkRM() {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('rmlogin')
    }
  }

  public authenticated() {
    if (isPlatformBrowser(this.platformId)) {
      if(localStorage.getItem('token') === 'undefined') {
        localStorage.removeItem('token')
        return false
      }
      return tokenNotExpired() || this.checkRM()
    }
  }

  public hasUserType() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.authenticated()) {
        if(localStorage.getItem('rmlogin') !== null) return true
        if(localStorage.getItem('token') === 'undefined' || localStorage.getItem('token') === 'null') return localStorage.removeItem('token')
        let token = localStorage.getItem('token') || localStorage.getItem('rmlogin')
        this.auth0Manage = new auth0.Management({
          domain: 'truetube.eu.auth0.com',
          token: token
        });
        const profile = JSON.parse(localStorage.getItem('profile'))
        if(profile !== null) {
          if(profile.user_metadata) {
            if(profile.user_metadata.defferedProfileUpdate) {
              if (moment().diff(moment(profile.user_metadata.defferedProfileUpdate), 'days') < 1) {
                return true
              }
            }
            return (typeof profile.user_metadata.memberType !== 'undefined') ? true : false
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        return true
      }
    } else {
      return true
    }
  }

  public logout(event: any) {
    event.preventDefault()


    // Remove token from localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token')
      localStorage.removeItem('profile')
    }
    this.userProfile = undefined
    if (this.checkRM()) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('rmlogin')
        return window.location.href = 'http://www.truetube.co.uk/rm/logout.php'
      }
    }
    this.router.navigate(['/'])
  }
}

@Injectable()
export class LoggedInGuard implements CanActivate {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private auth: Auth,
  ) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return this.auth.authenticated() || !!localStorage.getItem('rmlogin')
    } else {
      return this.auth.authenticated()
    }
  }
}

export function authFactory(
  http: Http,
  options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
      // Config options if you want
    }), http, options)
  }

  // Include this in your ngModule providers
  export const AUTH_PROVIDERS = {
    provide: AuthHttp,
    deps: [Http, RequestOptions],
    useFactory: authFactory
  }
