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
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

// Avoid name not found warnings
declare let Auth0Lock: any
declare let auth0: any

@Injectable()
export class Auth {
  // Configure Auth0
  public lock
  public auth0
  private userProfile: any
  public loggedInStatus: any = new Subject()
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.lock = new Auth0Lock(
        myConfig.clientID,
        myConfig.domain,
        myConfig.options
      )
      this.auth0 = new auth0.WebAuth({
        domain: myConfig.domain,
        clientID: myConfig.clientID,
        callbackURL: 'http://localhost:3000/',
        responseType: 'token id_token'
      })
    this.lock.on('authenticated', (authResult: any) => {
      let redirectUrl: string = ''
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('token', authResult.idToken)
        redirectUrl = localStorage.getItem('redirectUrl')
      }
      // Fetch profile information
       this.lock.getProfile(authResult.idToken, (error: any, profile: any) => {
         if (error) {
           // Handle error
           return
         }
         if (isPlatformBrowser(this.platformId)) {
           localStorage.setItem('profile', JSON.stringify(profile))
         }
         this.userProfile = profile
         ga('set', 'userId', profile.user_id)
       })
       this.loggedInStatus.next('update')
      if (redirectUrl) {
          this.router.navigate([redirectUrl])
      } else {
          this.router.navigate(['/me'])
      }
    })

    this.lock.on('show', () => {
      if (isPlatformBrowser(this.platformId)) {
        let parent: any = document.querySelectorAll('.auth0-lock-body-content')
        parent[0].insertAdjacentHTML('beforebegin', '<div class="rm-unify-login"><a class="btn btn-rm-unify">Log In with <img src="/assets/images/logo_RM.png" /></a>or<div>')
        document.querySelectorAll('.btn-rm-unify')[0].addEventListener('click', (event) => {
          this.loginWithRM(event)
        })
      }
    })

    }
  }

  public isAuthed(authResult: any) {
    let redirectUrl: string = ''
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', authResult.id_token)
      redirectUrl = localStorage.getItem('redirectUrl')
    }
    this.auth0.client.userInfo(authResult.access_token, (err, user) => {
      console.log(localStorage.getItem('token'));
      console.log(err)
      console.log(user)
        // Now you have the user's information
      if (isPlatformBrowser(this.platformId)) {
           localStorage.setItem('profile', user)
         }

         this.userProfile = user
         this.loggedInStatus.next('update')
       if (redirectUrl) {
           this.router.navigate([redirectUrl])
       } else {
           this.router.navigate(['/me'])
       }
      //ga('set', 'userId', user.user_id)
    });
  }

  public login(event: any) {
    event.preventDefault()
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('redirectUrl', this.router.url)
    }
    this.lock.show()
  }

  // public login(data) {
  //   console.log('logging in')
  //   //event.preventDefault()
  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.setItem('redirectUrl', this.router.url)
  //   }
  //   this.auth0.client.login({
  //     realm: 'Username-Password-Authentication', //connection name or HRD domain
  //     username: data.email,
  //     password: data.password,
  //     scope: 'read:order write:order',
  //     }, function(err, authResult) {
  //       console.log('There was an error', err)
  //       if(err) return err
  //       console.log('The result', authResult)
  //
  //   });
  // }

  public signup(event: any) {
    event.preventDefault()
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('redirectUrl', '/me')
    }
    this.lock.show({initialScreen: 'signUp'})
  }

  public loginWithState(event: any, state: any) {
    event.preventDefault()
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('redirectUrl', this.router.url + state)
    }
    this.lock.show()
  }

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
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    if (isPlatformBrowser(this.platformId)) {
      return tokenNotExpired() || this.checkRM()
    }
  }

  public logout(event: any) {
    event.preventDefault()


    // Remove token from localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token')
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
  constructor(private auth: Auth) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.auth.authenticated() || !!localStorage.getItem('rmlogin')
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
