import { Component, OnInit } from '@angular/core'
import { Http } from '@angular/http'
import { Router } from '@angular/router'

@Component({
  selector: 'app-rm-auth',
  templateUrl: './rm-auth.html'

})
export class RmAuthComponent implements OnInit {
    private url = 'https://www.truetube.co.uk/v5/api/checkauth'

    constructor(private http: Http, private router: Router) {}

    ngOnInit() {
        return this.http.get(this.url)
            .map(r => r.json())
            .subscribe(
                success => {
                    if (success.authenticated) {
                        // logged in via RM Unify
                        localStorage.setItem('rmlogin', success.token)
                        this.router.navigate(['/me'])
                    } else {
                        // not logged in via RM Unify
                        this.router.navigate(['/'])
                    }
                },
                error => {
                    console.log('error checking authentication')
                    this.router.navigate(['/'])
                    return true
                }
            )
    }
}
