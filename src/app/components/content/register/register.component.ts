import { PLATFORM_ID, Component, OnInit, Inject, Input } from '@angular/core'
import { DataService } from './../../../services/data.service'
import { ValidationService } from './../../../services/validation.service'
import { Auth } from './../../../services/auth.service'
import { myConfig } from './../../../services/auth.config'

import { ActivatedRoute, Router } from '@angular/router'
import { ContentTypes } from './../../../definitions/content-types'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'
import * as _ from 'lodash'
import * as moment from 'moment'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {
  @Input() control: FormControl
  public data: any
  public form
  public userType: string
  public userTitle: string
  public districts: any[]
  public schools: any[]
  public schoolsList: any[]
  public selectedSchool
  public location: string = null
  public type: string = null
  public model: any
  public showAuthority: boolean
  public showSchools: boolean
  public newsletterSubscribe = true
  public hasErrors = false
  public registrationError: string
  public formErrors = {
    email: false,
    password: false,
    country: false,
    teacherType: false,
    location: false,
    authority: false,
    school: false
  }
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    public auth: Auth
) {

  }
  ngOnInit() {
    this.dataService.districts()
    .subscribe(
      (data) => {
        this.districts = _.map(data.features, item => {
          return item['attributes']['LAD16NM']
        })
      })
  }

  register(form) {
    this.errorCheck(form)
    if (this.hasErrors) return
    const signupData = {
      connection: 'Username-Password-Authentication',
      redirect_uri: 'http://staging.truetube.co.uk/authcallback',
      email: form.controls.email.value,
      password: form.controls.password.value,
      user_metadata: {
        memberType: form.controls.memberType.value,
        newsletter: (form.controls.newsletter.value) ? 'true' : 'false'
      }
    }
    if (form.controls.memberType.value === 'teacher') {
      signupData.user_metadata['teacherType'] = form.controls.teacherTypeSelect.value
      if(form.controls.teacherTypeSelect.value === 'permanent') {
        signupData.user_metadata['location'] = form.controls.location.value
        signupData.user_metadata['authority'] = form.controls.authority.value
        signupData.user_metadata['school'] = this.selectedSchool._id
      }
    }

    if (form.controls.memberType.value === 'student') {
      signupData.user_metadata['studentType'] = form.controls.studentTypeSelect.value
    }


    this.auth.auth0.redirect.signupAndLogin(signupData, (err, authResult) => {
        if(err) {
          this.registrationError = err.description
        }
        if(authResult) {
        }
    });
  }

  errorCheck(form) {
    this.hasErrors = false
    for (let formElement in form.controls) {
      if (form.controls[formElement]['_status'] === 'INVALID') {
        this.formErrors[formElement] = true
        this.hasErrors = true
      } else {
        this.formErrors[formElement] = false
        if(formElement === 'authority') {
          setTimeout(() => {
            this.setAuthority(form.controls[formElement]['_value'])
          }, 500)
        }
        if(formElement === 'school') {
          setTimeout(() => {
            this.setSchool(form.controls[formElement]['_value'])
          }, 500)

        }
      }
    }
  }

  setLocation(country: string) {
    this.location = country
    this.showAuthority = (this.location !== 'other' && this.location !== null && this.type === 'permanent') ? true : false
  }

  setTeacherType(type: string) {
    this.type = type
    this.showAuthority = (this.type === 'permanent' && this.type !== null && this.location !== null && this.location !== 'other') ? true : false
    if(this.type === 'permanent') {
      this.form = this.formBuilder.group({
        'memberType' : ['teacher'],
        'email' : [this.form.controls.email.value, Validators.email],
        'password' : [this.form.controls.password.value, Validators.required],
        'teacherTypeSelect' : [this.type, Validators.required],
        'location' : ['', Validators.required],
        'authority' : ['', Validators.required],
        'school' : ['', Validators.required],
        'newsletter': [true]
      })
    } else {
      this.form = this.formBuilder.group({
        'memberType' : ['teacher'],
        'email' : [this.form.controls.email.value, Validators.email],
        'password' : [this.form.controls.password.value, Validators.required],
        'location' : ['', Validators.required],
        'teacherTypeSelect' : [this.type, Validators.required],
        'newsletter': [true]
      })

    }
  }

  setAuthority(authority: string) {
    this.dataService.schools(authority)
    .subscribe(
      (data) => {
        this.showSchools = true
        this.schoolsList = data.hits.hits
        this.schools = _.map(this.schoolsList, item => {
          return item['_source']['name']
        })
      })
  }

  setSchool(school: string) {
    this.selectedSchool = _.find(this.schoolsList, s => {
      return school = s['_source']['name']
    })
  }

  setUserType(type: string) {
    this.userType = type
    this.userTitle = (this.userType === 'other') ? _.upperFirst(this.userType) : 'a ' + _.upperFirst(this.userType)
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
    }
    if (this.userType === 'teacher') {
      this.form = this.formBuilder.group({
        'memberType' : ['teacher'],
        'email' : ['', Validators.email],
        'password' : ['', Validators.required],
        'teacherTypeSelect' : ['', Validators.required],
        'location' : ['', Validators.required],
        'newsletter': [true]
      })
    } else if (this.userType === 'student') {
      this.form = this.formBuilder.group({
        'memberType' : ['student'],
        'email' : ['', Validators.email],
        'password' : ['', Validators.required],
        'studentTypeSelect' : ['', Validators.required],
        'newsletter': [true]
      })

    } else {
      this.form = this.formBuilder.group({
        'memberType' : ['other'],
        'email' : ['', Validators.email],
        'password' : ['', Validators.required],
        'newsletter': [true]
      })
    }
  }
  searchAuthority = (authority: Observable<string>) => {
    return authority
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.districts.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  }

  searchSchools = (school: Observable<string>) => {
    return school
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term.length < 2 ? []
        : this.schools.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 20))
  }
}
