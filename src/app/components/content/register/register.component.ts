import { PLATFORM_ID, Component, OnInit, Inject, Input } from '@angular/core'
import { DataService } from './../../../services/data.service'
import { ValidationService } from './../../../services/validation.service'

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
  public location: string = null
  public type: string = null
  public model: any
  public showAuthority: boolean
  public formErrors = {
    email: false,
    password: false,
    country: false,
    teacherType: false
  }
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
) {
  this.form = formBuilder.group({
    'email' : ['', Validators.email],
    'password' : ['', Validators.required],
    'teacherTypeSelect' : ['', Validators.required],
    'countrySelect' : ['', Validators.required],
    'authority' : ['', Validators.required],
    'school' : ['', Validators.required],
  })
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
  }

  errorCheck(form) {
    for (let formElement in form.controls) {
      console.log(formElement)
      console.log(form.controls[formElement])
      if (form.controls[formElement]['_status'] === 'INVALID') {
        this.formErrors[formElement] = true
      } else {
        this.formErrors[formElement] = false
        if(formElement === 'authority') {
          setTimeout(() => {
            this.setAuthority(form.controls[formElement]['_value'])
          }, 1000)

        }
      }
    }

    return null;
  }

  setLocation(country: string) {
    this.location = country
    this.showAuthority = (this.location !== 'other' && this.location !== null && this.type === 'permanent') ? true : false
  }

  setTeacherType(type: string) {
    this.type = type
    this.showAuthority = (this.type === 'permanent' && this.type !== null && this.location !== null && this.location !== 'other') ? true : false
  }

  setAuthority(authority: string) {
    console.log('authority')
    console.log(authority)

    this.dataService.schools(authority)
    .subscribe(
      (data) => {
        this.schoolsList = data.hits.hits
        this.schools = _.map(this.schoolsList, item => {
          return item['_source']['name']
        })
      })

    // this.type = type
    //
    // this.showAuthority = (this.type === 'permanent' && this.type !== null && this.location !== null && this.location !== 'other') ? true : false
  }

  setUserType(type: string) {
    this.userType = type
    this.userTitle = _.upperFirst(this.userType)
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0)
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
        : this.schools.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  }
}
