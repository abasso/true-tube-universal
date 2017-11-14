import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import * as moment from 'moment'
import * as Cookies from 'js-cookie'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { ActivatedRoute } from '@angular/router'
import { Auth } from './../../services/auth.service'

@Component({
  selector: 'app-auth-redirect',
  template: ''
})
export class AuthRedirectComponent {

  constructor (
    private route: ActivatedRoute,
    private auth: Auth
  ) {
    this.route.fragment.subscribe((fragment: string) => {
        const fragmentArray = fragment.split('&')
        const fragments = {}
        for(let i = 0; i< fragmentArray.length; i++) {
          const splitFrag = fragmentArray[i].split('=')
          fragments[splitFrag[0]] = splitFrag[1]
        }
        this.auth.isAuthed(fragments)
     })
    }

}
