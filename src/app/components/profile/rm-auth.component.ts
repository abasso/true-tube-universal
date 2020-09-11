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
                        localStorage.setItem('rmlogin', success.token)
                        localStorage.setItem('token', success.token)
                        this.router.navigate(['/me'])
                    } else {
                        this.router.navigate(['/'])
                    }
                },
                error => {
                    this.router.navigate(['/'])
                    return true
                }
            )
    }
}
