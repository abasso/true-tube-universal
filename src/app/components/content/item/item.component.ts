import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
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
import { Angulartics2 } from 'angulartics2'

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
export class ItemComponent implements OnInit {
  public item: any = {}
  public data: any
  public slug: string
  public showEmbed = false
  public embedButtonLabel = 'Copy'
  public embedButtonClass = 'btn-video'
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
  public addListErrorMessage = 'An error occured'
  public listArray: any[] = []
  public listButtonClass = 'btn-lesson-plan'
  public listButtonLabel = 'Create List &amp; Add'
  public notificationMessage = ''
  public showNotification = false
  public notificationRemove = false
  public notificationFavourite = false
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

    public angulartics2: Angulartics2,
    private meta: MetaService
  ) {}

  ngOnInit() {
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

  hasAttributes(attribute: any) {
    return (_.isUndefined(attribute) || attribute === null || attribute === false || attribute.length === 0) ? false : true
  }

  navigateAttribute(event: any, type: string, attribute: string) {
    event.preventDefault()
    this.router.navigateByUrl('/list?' + type + '=' + encodeURIComponent(attribute))
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({ action: 'Navigate', properties: { category: 'Content Info ' + type, title: attribute}})
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
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({ action: event, properties: { category: 'Content Tab', title: ''}})
    }
  }

  tab(event: any) {
    this.router.navigateByUrl(this.item.slug + '?tab=' + event)
    this.hideAdvisory = false
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
        this.angulartics2.eventTrack.next({ action: 'Create', properties: { category: 'List', title: this.createListTitle}})
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
          this.angulartics2.eventTrack.next({ action: 'Add', properties: { category: 'List', title: this.item.id}})
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
          this.angulartics2.eventTrack.next({ action: 'Remove', properties: { category: 'List', title: this.item.id}})
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
