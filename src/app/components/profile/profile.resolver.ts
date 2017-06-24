import {Injectable} from '@angular/core'
import {Profile} from './profile.model'
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router'
import {Observable} from 'rxjs'
import {AuthHttp} from 'angular2-jwt'

import * as _ from 'lodash'
import {Http} from "@angular/http";

@Injectable()
export class ProfileResolver implements Resolve<Profile> {
    // TODO: load this from injectable config object?
    private profileUrl = 'https://www.truetube.co.uk/v5/api/me'

    constructor(private http: AuthHttp, private plainHttp: Http) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Profile> {

        if (!!localStorage.getItem('rmlogin')) {
            return this.plainHttp.get(this.profileUrl)
                .map(r => r.json())
                .map(Profile.hydrate);
        }
        return this.http.get(this.profileUrl)
            .map(r => r.json())
            .map(Profile.hydrate)
    }
}
