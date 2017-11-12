import { Component, OnInit, Input } from '@angular/core'
import { DataService } from './../../services/data.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Auth } from './../../services/auth.service'
import { myConfig } from './../../services/auth.config'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @Input('showLogin') showLogin
  public showFeedback = false
  public textarea: string
  public form
  public lock
  public error
  public feedback: any = {
    type: '',
    feedback: '',
    // json: {}
  }
  public feedbackTypes: any = [
    {
      value: 'general',
      label: 'General feedback'
    },
    {
      value: 'site',
      label: 'Feedback about the site'
    },
    {
      value: 'page',
      label: 'Feedback about this page'
    }
  ]

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder,
    public auth: Auth
  ) {

  this.form = formBuilder.group({
    'email' : [null, Validators.required],
    'password' : [null, Validators.required],
  })
  }

  ngOnInit() {
  }

  login(data) {
    this.auth.auth0.client.login({
      realm: 'Username-Password-Authentication', //connection name or HRD domain
      username: data.email,
      password: data.password,
      // audience: 'https://truetube.eu.auth0.com/api/v2/',
    }, (err, authResult) => {
        if(err) {
          this.error = err
          console.log(this.error)
        }
        if(authResult) {
          this.auth.isAuthed(authResult)
          this.showLogin = false
        }
    })
  }

}
