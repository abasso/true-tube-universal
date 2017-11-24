import { PLATFORM_ID, Component, OnInit, DoCheck, Inject } from '@angular/core'
import { Location } from '@angular/common'
import { DataService } from './../../../services/data.service'
import { UserService } from './../../../services/user.service'
import { AttributePipe } from './../../../pipes/attribute.pipe'
import { SanitiseUrlPipe } from './../../../pipes/sanitise-url.pipe'
import { ContentTypes } from './../../../definitions/content-types'
import { ActivatedRoute, Router } from '@angular/router'
import { Auth } from './../../../services/auth.service'
import * as moment from 'moment'
import * as _ from 'lodash'
import 'rxjs/add/operator/switchMap'
import { Headers } from '@angular/http'
import {AuthHttp} from 'angular2-jwt'
import { AnalyticsService } from './../../../services/analytics.service'

import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { MetaService } from '@ngx-meta/core'

declare var videojs: any

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  providers: [
    AttributePipe,
    SanitiseUrlPipe
  ]
})
export class ItemComponent implements OnInit, DoCheck {
  public item: any = {}
  public data: any
  public slug: string
  public showEmbed = false
  public embedButtonLabel = 'Copy'
  public embedButtonClass = 'btn-video'
  public codeButtonLabel = 'Submit'
  public codeButtonClass = ''
  public embeddedContent: any = []
  public activeTab = 'film'
  public types: any
  public hideAdvisory = false
  public addedToFavourites = false
  public userData: any
  public listTitle: any
  public showLists = false
  public play = false
  public enableSubtitles = false
  public createListTitle = ''
  public addListError = false
  public useAccessCode = false
  public addListErrorMessage = 'An error occured'
  public listArray: any[] = []
  public listButtonClass = 'btn-lesson-plan'
  public listButtonLabel = 'Create List &amp; Add'
  public notificationMessage = ''
  public showNotification = false
  public notificationRemove = false
  public notificationFavourite = false
  public contentAccess = false
  public viewRemainingCount = 1
  public accessCode: string
  public apiUrl = 'https://www.truetube.co.uk/v5/api/me'
  public advisoryMessage = '<p>This video may contain content <strong>unsuitable for sensitive or younger students.</strong> Teacher discretion is advised.</p>'
  public paginationData = {
    currentPage: 0,
    itemsPerPage: 100000
  }
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private userService: UserService,
    private location: Location,
    private auth: Auth,
    private http: AuthHttp,
    public analyticsService: AnalyticsService,
    private meta: MetaService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      if (localStorage.getItem('authedByCode') !== null) {
        const currentAuthCode = JSON.parse(localStorage.getItem('authedByCode'))
        if (moment().diff(moment(currentAuthCode.timestamp), 'minutes') > 1440) {
          localStorage.removeItem('authedByCode')
        }
      }

      if (localStorage.getItem('watchedUnregistered') === 'true' && !this.auth.authenticated() && localStorage.getItem('authedByCode') === null) {
        this.viewRemainingCount = 0;
      } else if (this.auth.authenticated() || localStorage.getItem('authedByCode') !== null) {
        this.viewRemainingCount = 1
        this.contentAccess = true
      }
    }
    this.types = ContentTypes
    this.data = this.route.url
    .switchMap((url: any) => this.dataService.itemBySlug(url))
    .subscribe(
      (data) => {
        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0)
        }

        this.item = data.hits.hits[0]._source

        let strippedDescription = this.item.description.replace(/(<([^>]+)>)/ig,"")

        this.meta.setTitle(this.item.title)
        this.meta.setTag('description', strippedDescription)
        this.meta.setTag('og:url', 'https://www.truetube.co.uk' + this.item.slug)
        this.meta.setTag('og:image', 'https:' + this.item.thumbnail[0].url)
        // this.meta.setTag('og:description', strippedDescription)
        // this.meta.setTag('og:title', this.item.title + " - TrueTube")

        this.embeddedContent = _.groupBy(this.item.embedded, 'type')
        if (this.item.resource_types.length === 1) {
          this.item.hideMenu = true
        }
        _.each(this.item.embedded, (embed) => {
          if (embed === null) {
            return
          }
          if (embed.thumbnail === null) {
            embed.thumbnail = this.item.thumbnail
          }
        })
        _.each(this.item.related, (item) => {
          item.contenttypes = []
          _.each(item.resource_types, (type, key) => {
            if (_.findIndex(this.types, {'term': type.type}) !== -1) {
              item.contenttypes.push({'label': type.label, 'class': 'btn-' + type.type.replace('_', '-'), 'query': { 'tab': type.type}})
            }
          })
        })
        if (this.auth.authenticated()) {
          this.isItemInList()
        }
        this.route.queryParams
        .map(params => params['tab'])
        .subscribe((type) => {
          if (!_.isUndefined(type)) {
            this.setActiveTab(type)
          } else {
            this.setActiveTab(this.item.resource_types[0].type)
          }
        })
      }
    )
    this.auth.loggedInStatus.subscribe((data: any) => {
      this.isItemInList()
    })
  }

  ngDoCheck()	{
    if (isPlatformBrowser(this.platformId)) {
      if(this.auth.authenticated() || localStorage.getItem('authedByCode') !== null) {
        this.viewRemainingCount = 1
        this.contentAccess = true
      }
    } else {
      if(this.auth.authenticated()) {
        this.viewRemainingCount = 1
        this.contentAccess = true
      }
    }
  }

  showAccessCode(event) {
    event.preventDefault()
    this.useAccessCode = (this.useAccessCode === true) ? false : true
  }

  register(event: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('redirectUrl', this.router.url)
    }
  }

  hasAttributes(attribute: any) {
    return (_.isUndefined(attribute) || attribute === null || attribute === false || attribute.length === 0) ? false : true
  }

  navigateAttribute(event: any, type: string, attribute: string) {
    event.preventDefault()
    this.router.navigateByUrl('/list?' + type + '=' + encodeURIComponent(attribute))
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsService.emitEvent('Content Info' + type, 'Navigate', attribute)
    }
  }

  duration(seconds: number) {
    return moment('2017-01-01').startOf('day').seconds(seconds).format('mm:ss')
  }

  age(seconds: number) {
    return moment.unix(seconds).fromNow()
  }

  toggleEmbed(event: any) {
    event.preventDefault()
    return this.showEmbed = (this.showEmbed) ? false : true
  }

  setActiveTab(event: any) {
    event = event.replace(' ', '_')
    this.activeTab = event
  }

  tab(event: any, item: any) {
    this.router.navigateByUrl(this.item.slug + '?tab=' + event.term)
    this.hideAdvisory = false
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsService.emitEvent('Content Tab', event.tabLabel, item.title)
    }
  }

  checkAccessCode(event: any, item: string) {
    event.preventDefault()
    this.dataService.checkAccessCode(this.accessCode).subscribe(
      res => {
        if (res.status === 200) {
          if (isPlatformBrowser(this.platformId)) {
            this.analyticsService.emitEvent('Access code correct - ' + this.accessCode, 'Action', item)
            const accessData = {value: this.accessCode, timestamp: new Date().getTime()}
            localStorage.setItem('authedByCode', JSON.stringify(accessData))
          }
        }
      },
      err => {
        this.analyticsService.emitEvent('Access code incorrect - ' + this.accessCode, 'Action', item)
        this.codeButtonLabel = 'Incorrect Code'
        this.codeButtonClass = 'btn-error'
        setTimeout(() => {
          this.codeButtonLabel = 'Submit'
          this.codeButtonClass = ''
        }, 2000)
      }
    )
  }

  embedCopySuccess(event: any) {
    this.embedButtonLabel = 'Copied'
    this.embedButtonClass = 'btn-success'
    setTimeout(() => {
      this.embedButtonLabel = 'Copy'
      this.embedButtonClass = 'btn-video'
    }, 1000)
  }

  addToFavourites(event: any) {
    event.preventDefault()
    this.notificationFavourite = true
    this.userService.addToList('favourites', this.item.id)
    _.find(this.listArray, (listItem) => {
      if (listItem.title === 'Favourites') {
        listItem.checked = true
      }
    })
    this.toggleNotification('Favourites', true)
    this.addedToFavourites = true
  }

  removeFromFavourites(event: any) {
    event.preventDefault()
    this.notificationFavourite = true
    this.userService.removeFromList('favourites', this.item.id)
    _.find(this.listArray, (listItem) => {
      if (listItem.title === 'Favourites') {
        listItem.checked = false
      }
    })
    this.toggleNotification('Favourites', false)
    this.addedToFavourites = false
  }

  toggleLists(event: any) {
    event.preventDefault()
    if (this.showLists === true) {
      this.showLists = false
    } else {
      this.showLists = true
    }
  }

  addList(event: any) {
    if (_.findIndex(this.listArray, (list) => {
      return list.title === this.createListTitle
    }) !== -1) {
      this.addListError = true
      this.addListErrorMessage = 'A list with that name already exists'
      setTimeout(() => {
        this.addListError = false
      }, 3000)
    } else if (this.createListTitle !== '') {
      if (isPlatformBrowser(this.platformId)) {
        this.analyticsService.emitEvent('List', 'Create', this.createListTitle)
      }
      this.addListError = false
      let listSlug = _.kebabCase(this.createListTitle)
      let header = new Headers()
      header.append('Content-Type', 'application/json')
      this.http.post(this.apiUrl + '/' + listSlug + '/' + this.item.id, {
        title : this.createListTitle
      }, { headers: header }).subscribe(
        (data) => {
          this.listArray.push({
            title: this.createListTitle,
            checked: true
          })

          this.toggleNotification(this.createListTitle, true)
          setTimeout(() => {
            this.createListTitle = ''
          }, 2200)
        })
      } else {
        this.addListError = true
        this.addListErrorMessage = 'Please enter a list name'
        setTimeout(() => {
          this.addListError = false
        }, 3000)
      }
    }

    toggleNotification(list: any, added: any) {
      this.showNotification = false
      let message = 'Removed from '
      if (added === false) {
        this.notificationRemove = true
      } else {
        message = 'Added to '
        this.notificationRemove = false
      }
      this.notificationMessage = message + list
      this.showNotification = true
      setTimeout(() => {
        this.showNotification = false
      }, 3000)
    }

    setList(event: any, key: any, title: string) {
      if (event.target.checked) {
        this.notificationFavourite = false
        if (key === 'favourites') {
          this.addedToFavourites = true
          this.notificationFavourite = true
        }
        this.toggleNotification(title, true)
        this.http.post(this.apiUrl + '/' + key + '/' + this.item.id, {}).subscribe(
          (data) => {
            if (isPlatformBrowser(this.platformId)) {
              this.analyticsService.emitEvent('List', 'Add', this.item.id)
            }
          })
        } else {
          this.notificationFavourite = false
          this.toggleNotification(title, false)
          if (key === 'favourites') {
            this.addedToFavourites = false
            this.notificationFavourite = true
          }
          this.http.delete(this.apiUrl + '/' + key + '/' + this.item.id).subscribe(
            (data) => {
              if (isPlatformBrowser(this.platformId)) {
                this.analyticsService.emitEvent('List', 'Remove', this.item.id)
              }
            })
          }
        }

        keyCheck(event: any) {
          if (event.key === 'Enter') {
            this.addList(event)
          }
        }

        playPlayer(event: any) {
          event.preventDefault()
          this.play = true
          this.hideAdvisory = true
        }

        playerEvent(event: string) {
          if (!this.auth.authenticated() && localStorage.getItem('authedByCode') === null) {
            this.viewRemainingCount = 0;
          }
        }


        playSubtitlePlayer(event: any) {
          event.preventDefault()
          event.target.blur()
          this.play = true
          this.hideAdvisory = true
          this.enableSubtitles = true
        }

        isItemInList() {
          this.http.get(this.apiUrl)
          .subscribe(
            (data) => {
              this.addedToFavourites = false
              this.userData = JSON.parse(data['_body'])
              this.listArray = []
              _.each(this.userData.lists, (list, key) => {
                let arrayItem = {
                  title: list.title,
                  key: key,
                  checked: false,
                  order: 1
                }
                _.each(list.items, (listItem) => {
                  if (listItem === this.item.id && list.title === 'Favourites') {
                    arrayItem.checked = true
                    this.addedToFavourites = true
                    arrayItem.order = 0
                  } else if (listItem === this.item.id) {
                    arrayItem.checked = true
                    this.listTitle = list.title
                  }
                })
                this.listArray.push(arrayItem)
              })
            }
          )
        }
      }
