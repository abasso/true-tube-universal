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
  public redirectUri = 'www.truetube.co.uk'
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
        this.districts = _.map(data.aggregations.group_by_la.buckets, item => {
          return item['key']
        })
      })
      if (isPlatformBrowser(this.platformId)) {
        this.redirectUri = window.location.host
      }
  }

  register(form) {
    this.registerErrorCheck(form)
    if (this.hasErrors) return
    const signupData = {
      connection: 'Username-Password-Authentication',
      redirect_uri: 'http://' + this.redirectUri + '/authcallback',
      email: form.controls.email.value,
      password: form.controls.password.value,
      user_metadata: {
        memberType: form.controls.memberType.value
      }
    }
    if (form.controls.memberType.value === 'teacher') {
      signupData.user_metadata['teacherType'] = form.controls.teacherTypeSelect.value
      if(form.controls.teacherTypeSelect.value === 'full' || form.controls.teacherTypeSelect.value === 'part') {
        signupData.user_metadata['location'] = form.controls.location.value
        signupData.user_metadata['authority'] = form.controls.authority.value
        signupData.user_metadata['school'] = this.selectedSchool._id
      }
      let keystages = {
        'keystage1' : form.controls.keystage1.value.toString(),
        'keystage2' : form.controls.keystage2.value.toString(),
        'keystage3' : form.controls.keystage3.value.toString(),
        'keystage4' : form.controls.keystage4.value.toString(),
        'sixthForm' : form.controls.sixthForm.value.toString(),
        'furtherEducation' : form.controls.furtherEducation.value.toString()
      }
      signupData.user_metadata['keystages'] = JSON.stringify(keystages)
      signupData.user_metadata['newsletter'] = form.controls.newsletter.value.toString()
    }
    if (form.controls.memberType.value === 'student') {
      signupData.user_metadata['studentType'] = form.controls.studentTypeSelect.value
      if (form.controls.studentTypeSelect.value === 'other') {
        signupData.user_metadata['studentTypeOther'] = form.controls.studentTypeOther.value
      }
    }
    if (form.controls.memberType.value === 'other') {
      signupData.user_metadata['newsletter'] = (form.controls.newsletter.value) ? 'true' : 'false'
    }


    this.auth.auth0.redirect.signupAndLogin(signupData, (err, authResult) => {
        if(err) {
          this.registrationError = err.description
        }
        if(authResult) {
          this.userType = null
        }
    });
  }

  errorCheck(form) {
    this.hasErrors = false
    for (let formElement in form.controls) {
      if (form.controls[formElement]['_status'] === 'INVALID' && form.controls[formElement]['_touched'] === true && form.controls[formElement]['_pristine'] === false) {
        this.formErrors[formElement] = true
        this.hasErrors = true
      } else {
        this.formErrors[formElement] = false
        if(formElement === 'authority' && form.controls[formElement]['_pristine'] === false) {
          setTimeout(() => {
            this.setAuthority(form.controls[formElement]['_value'])
          }, 500)
        }
        if(formElement === 'school' && form.controls[formElement]['_pristine'] === false) {
          setTimeout(() => {
            this.setSchool(form.controls[formElement]['_value'])
          }, 500)

        }
      }
    }
  }

  registerErrorCheck(form) {
    this.hasErrors = false
    for (let formElement in form.controls) {
      if (form.controls[formElement]['_status'] === 'INVALID' &&  formElement !== 'studentTypeOther') {
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
    this.showAuthority = (this.location !== 'other' && this.location !== null && this.type === 'full' || this.location !== 'other' && this.location !== null && this.type === 'part') ? true : false
  }

  setTeacherType(type: string) {
    this.type = type
    this.showAuthority = (this.type === 'full' && this.type !== null && this.location !== null && this.location !== 'other' || this.type === 'part' && this.type !== null && this.location !== null && this.location !== 'other') ? true : false
    if(this.type === 'full' || this.type === 'part') {
      this.form = this.formBuilder.group({
        'memberType' : ['teacher'],
        'email' : [this.form.controls.email.value, Validators.email],
        'password' : [this.form.controls.password.value, Validators.required],
        'teacherTypeSelect' : [this.type, Validators.required],
        'teacherSubjectSelect' : ['', Validators.required],
        'location' : ['', Validators.required],
        'authority' : ['', Validators.required],
        'school' : ['', Validators.required],
        'keystage1' : [false],
        'keystage2' : [false],
        'keystage3' : [false],
        'keystage4' : [false],
        'sixthForm' : [false],
        'furtherEducation' : [false],
        'newsletter': [true]
      })
    } else {
      this.form = this.formBuilder.group({
        'memberType' : ['teacher'],
        'email' : [this.form.controls.email.value, Validators.email],
        'password' : [this.form.controls.password.value, Validators.required],
        'location' : ['', Validators.required],
        'teacherTypeSelect' : [this.type, Validators.required],
        'teacherSubjectSelect' : ['', Validators.required],
        'keystage1' : [false],
        'keystage2' : [false],
        'keystage3' : [false],
        'keystage4' : [false],
        'sixthForm' : [false],
        'furtherEducation' : [false],
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
        this.schools = _.uniq(this.schools)
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
        'teacherSubjectSelect' : ['', Validators.required],
        'location' : ['', Validators.required],
        'keystage1' : [false],
        'keystage2' : [false],
        'keystage3' : [false],
        'keystage4' : [false],
        'sixthForm' : [false],
        'furtherEducation' : [false],
        'newsletter': [true]
      })
    } else if (this.userType === 'student') {
      this.form = this.formBuilder.group({
        'memberType' : ['student'],
        'email' : ['', Validators.email],
        'password' : ['', Validators.required],
        'studentTypeSelect' : ['', Validators.required],
        'studentTypeOther' : ['']
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
