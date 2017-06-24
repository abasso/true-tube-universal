import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import { Location } from '@angular/common'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ListingComponent } from './list.component'
import { DataService } from './../../../services/data.service'
import { Categories } from './../../../definitions/categories'
import { Subjects } from './../../../definitions/subjects'
import { ContentTypes } from './../../../definitions/content-types'
import { KeyStages } from './../../../definitions/key-stages'
import { ListService } from './../../../services/list.service'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import * as _ from 'lodash'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html'
})
export class ListFilterComponent implements OnInit {
  public contentLoading = true
  public topics: any[] = []
  public filterSubjects: string
  public categories: any[] = Categories
  public types: any[] = ContentTypes
  public subjects: any[] = Subjects
  public keystages: any[] = KeyStages
  public category: any = null
  public currentItemCount: number
  public items: any
  public itemsTotal = 0
  public itemsTotalLabel = 'Items'
  public filter: FormGroup
  public currentParams: any
  public currentCategory: string
  public currentCategoryString: string
  public currentType: any
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private listService: ListService,
    private route: ActivatedRoute,
    private router: Router,
    private ListingComponent: ListingComponent,
    private dataService: DataService,
    private location: Location,
    private formBuilder: FormBuilder,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2

  ) {
    listService.pathToReset$.subscribe(
      query => {
        this.route.queryParams
        .subscribe((params) => {
          this.currentParams = _.assign({}, params)
        })
      })

    let formElements: any = {
      term: '',
      subject: '',
      category: ''
    }
    _.each(this.types, (type) => {
      formElements[type.name] = ''
    })

    _.each(this.keystages, (keystage) => {
      formElements[keystage.name] = ''
    })

    _.each(this.categories, (category) => {
      formElements[category.name] = ''
      _.each(category.topics, (topic) => {
        formElements[topic.name] = ''
      })
    })

    this.filter = formBuilder.group(formElements)
    this.route.queryParams
    .subscribe((params) => {
      this.currentParams = _.assign({}, params)
    })
    this.types = ContentTypes
  }

  ngOnInit() {
    this.filterSubjects = 'All'
    this.filter.patchValue({subject: 'All'})
    this.ListingComponent.data = this.filter.valueChanges
    .debounceTime(400)
    .distinctUntilChanged()
    .switchMap(data => this.dataService.search(data, this.types, this.keystages, this.filterSubjects, this.topics, this.category))

    this.items = this.ListingComponent.data.subscribe(
      (data) => {
        this.contentLoading = false
        this.ListingComponent.paginationData.totalItems = data.hits.hits.length
        this.ListingComponent.itemCount = data.hits.total
        this.ListingComponent.items = data.hits.hits
        _.each(this.ListingComponent.items, (item) => {
          item._source.description = this.dataService.trimDescription(item._source.description)
          if (_.endsWith(item._source.description, '...')) {
            item.readMore = true
          }
          _.each(this.categories, (category) => {
            _.each(category.topics, (subCategory) => {
              _.each(item._source.topic, (topic) => {
                if (topic === subCategory.label) {
                  item._source.category = category
                }
              })
            })
          })
        })
        _.each(data.hits.hits, (item) => {
          if (_.findIndex(item._source.embedded, {'advisory': '1'}) !== -1) {
            item.advisory = true
          }
          item.typesCount = _.countBy(item._source.embedded, 'type')
          item.contenttypes = []
          _.each(item.typesCount, (type, key) => {
            let typestring = key.replace('_', ' ')
            if (_.findIndex(this.types, {'term': key}) !== -1) {
              item.contenttypes.push({'label': typestring, 'class': 'btn-' + key.replace('_', '-'), 'query': { 'tab': key}})
            }
          })
        })
        if (_.isUndefined(this.currentItemCount)) {
          this.currentItemCount = this.ListingComponent.itemCount
        }
        this.updateTotal(this.currentItemCount, this.ListingComponent.itemCount)
        this.ListingComponent.resetPagination()
      }
    )

    this.route.queryParams
    .map(params => params['content types'])
    .subscribe((types) => {
      if (!_.isUndefined(types)) {
        this.resetFilterState(this.types)
          let typeArray: any[] = types.split(',')
          _.each(typeArray, (type) => {
            if (typeArray.length === 1) {
              this.currentType = {
                'tab': _.trim(type, 's')
              }
            } else {
              this.currentType = {}
            }
            let pathType: any = _.find(this.types, { slug: type})
            pathType.active = true
            let patch: any = {}
            patch[pathType.name] = true
            this.filter.patchValue(patch)
          })
      } else {
        this.clearTypes(null)
      }
    })

    this.route.queryParams
    .map(params => params['keystages'])
    .subscribe((keystages) => {
      if (!_.isUndefined(keystages)) {
        this.resetFilterState(this.keystages)
          let keyArray: any = keystages.split(',')
          _.each(keyArray, (key) => {
            let pathKeys: any = _.find(this.keystages, { slug: key})
            pathKeys.active = true
            let patch: any = {}
            patch[pathKeys.name] = true
            this.filter.patchValue(patch)
          })
      } else {
        this.clearKeystages(null)
      }
    })

    this.route.queryParams
    .map(params => params['search'])
    .subscribe((search) => {
      if (!_.isUndefined(search)) {
        this.filter.patchValue({term: search})
      } else {
        this.clearTerm(null)
      }
    })

    this.route.queryParams
    .map(params => params['topics'])
    .subscribe((topics) => {
      if (!_.isUndefined(topics)) {
        this.setTopics(topics)
      } else {
        this.clearTopics(null)
      }
    })

    this.route.queryParams
    .map(params => params['category'])
    .subscribe((category) => {
      if (this.currentCategory === category) {
        return
      }
      if (!_.isUndefined(category)) {
        this.category = _.filter(this.categories, {slug: category})
        this.displayTopics(this.category[0].name)
      } else {
        if (_.findIndex(this.topics, {active: true}) === -1) {
          this.clearCategory()
        }
      }
    })

    this.route.queryParams
    .map(params => params['subject'])
    .subscribe((subject) => {
      if (!_.isUndefined(subject)) {
        let sub: any = _.find(this.subjects, {slug: subject})
        this.currentParams['subject'] = sub.slug
        this.filterSubjects = sub.label
        this.filter.patchValue({subject: sub.slug})
      } else {
        this.clearSubject(null)
      }
    })

  }

  querySubscription() {
    this.route.queryParams
    .subscribe((params) => {
      this.currentParams = _.assign({}, params)
    })
  }

  resetFilterState(filter: any) {
    _.each(filter, (item) => {
      item.active = false
      this.filter.patchValue({name: null})
    })
  }

  updateTotal(currentCount: number, newCount: number) {

    let countSpeed = 3
    let difference: number = currentCount - newCount

    if (this.itemsTotal > newCount) {
      countSpeed = (difference > 400) ? 81 : (difference > 200) ? 21 : 11
    } else {
      countSpeed = (difference < 400) ? 81 : (difference < 200) ? 21 : 11
    }

    if (countSpeed === 0) {
      countSpeed = 1
    }
    if (currentCount === newCount) {
      countSpeed = currentCount
    }
    let loop = () => {
      if (this.itemsTotal > newCount) {
        this.itemsTotal -= countSpeed
        if (this.itemsTotal <= newCount) {
          this.itemsTotal = this.ListingComponent.itemCount
          this.currentItemCount = this.ListingComponent.itemCount
          this.itemsTotalLabel = (newCount > 1) ? 'Items' : 'Item'
        } else {
          requestAnimationFrame( loop )
        }
      } else {
        this.itemsTotal += countSpeed
        if (this.itemsTotal >= newCount) {
          this.itemsTotal = this.ListingComponent.itemCount
          this.currentItemCount = this.ListingComponent.itemCount
          this.itemsTotalLabel = (newCount > 1) ? 'Items' : 'Item'
        } else {
          requestAnimationFrame( loop )
        }
      }
    }
    loop()
  }

  search(event: any) {
    let searchTimeout
    clearTimeout(searchTimeout)
    this.contentLoading = true
    if (event.key === 'Enter') {
      return
    }
    searchTimeout = setTimeout(
      () => {
        this.currentParams['search'] = event.target.value
        if (isPlatformBrowser(this.platformId)) {
          this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Search', label: event.target.value}})
        }
        this.setQueryString()
        this.ListingComponent.resetPagination()
    }, 500)
  }

  clearTerm(event: any) {
    this.contentLoading = true
    this.filter.patchValue({term: ''})
    delete this.currentParams.search
    if (event !== null) {
      if (isPlatformBrowser(this.platformId)) {
        this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear Term'}})
      }
      event.preventDefault()
      this.setQueryString()
    }
  }

  clearSubject(event: any) {
    this.contentLoading = true
    this.filter.patchValue({subject: 'All'})
    this.filterSubjects = 'All'
    delete this.currentParams.subject
    if (event !== null) {
      if (isPlatformBrowser(this.platformId)) {
        this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear Subject'}})
      }
      event.preventDefault()
      this.setQueryString()
    }
  }

  clearCategory() {
    this.category = null
    _.each(this.categories, (category) => {
      let toClear: any = {}
      toClear[category.name] = ''
      this.filter.patchValue(toClear)
      category.active = false
    })
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear Category'}})
    }
    delete this.currentParams.category
    this.setQueryString()
  }

  clearCategoryAndTopics(event: any) {
    this.contentLoading = true
    this.category = null
    _.each(this.topics, (topic) => {
      let toClear: any = {}
      toClear[topic.name] = ''
      this.filter.patchValue(toClear)
      topic.active = false
    })
    _.each(this.categories, (category) => {
      let toClear: any = {}
      toClear[category.name] = ''
      this.filter.patchValue(toClear)
      category.active = false
    })
    delete this.currentParams.category
    if (event !== null) {
      if (isPlatformBrowser(this.platformId)) {
        this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear Category and Topics'}})
      }
      event.preventDefault()
      this.setQueryString()
    }
  }

  clearTopics(event: any) {
    // if (_.isUndefined(this.currentParams.category)) return
    this.contentLoading = true
    _.each(this.topics, (topic) => {
      let toClear: any = {}
      toClear[topic.name] = ''
      this.filter.patchValue(toClear)
      topic.active = false
    })

    if (this.category !== null) {
      this.currentParams.category = this.category[0].slug
    }
    delete this.currentParams.topics
    if (event !== null) {
      if (isPlatformBrowser(this.platformId)) {
        this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Topics Clear'}})
      }
      event.preventDefault()
      this.setQueryString()
    }
  }

  clearTypes(event: any) {
    this.contentLoading = true
    this.currentType = {}
    _.each(this.types, (type) => {
      let toClear: any = {}
      toClear[type.name] = ''
      this.filter.patchValue(toClear)
      type.active = false
    })
    delete this.currentParams['content types']
    this.resetFilterState(this.types)
    if (event !== null) {
      if (isPlatformBrowser(this.platformId)) {
        this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Types Clear'}})
      }
      event.preventDefault()
      this.setQueryString()
    }
  }

  clearKeystages(event: any) {
    this.contentLoading = true
    delete this.currentParams.keystages
    this.resetFilterState(this.keystages)
    if (event !== null) {
      if (isPlatformBrowser(this.platformId)) {
        this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Keystages Clear'}})
      }
      event.preventDefault()
      this.setQueryString()
    }
  }

  clearAll(event: any) {
    if (event !== null) {
      event.preventDefault()
      if (isPlatformBrowser(this.platformId)) {
        this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear All'}})
      }
    }
    this.contentLoading = true
    this.clearSubject(event)
    this.clearCategoryAndTopics(event)
    this.clearTopics(event)
    this.clearTypes(event)
    this.clearKeystages(event)
    this.clearTerm(event)
  }

  setFilter(event: any, value: any) {
    if (!_.isUndefined(event)) {
      event.preventDefault()
    }
    this.contentLoading = true
    let filterQuery: any = (_.isUndefined(this.currentParams[value.type])) ? [] : this.currentParams[value.type].split(',')
    if (value.active) {
      filterQuery.splice(_.indexOf(filterQuery, value.slug), 1)
      value.active = false
      this.filter.patchValue({value: false})
    } else {
      filterQuery.push(value.slug)
      value.active = true
      this.filter.patchValue({value: true})
    }
    this.currentParams[value.type] = filterQuery.join()
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter ' + _.capitalize(value.type), label: this.currentParams[value.type]}})
    }
    this.setQueryString()
  }

  setQueryString() {
    let appendedQuery = ''
    let hasPage = false
    _.each(this.currentParams, (value, key) => {
      if (key === 'page') {
        hasPage = true
        appendedQuery += 'page=1&'
      } else if (value.length) {
        appendedQuery += key + '=' + value.trim() + '&'
      }
    })
    if (!hasPage) {
      appendedQuery += '&page=1'
    }
    this.router.navigateByUrl('/list?' + appendedQuery)
  }

  setSubject(event: any) {
    this.contentLoading = true
    this.filterSubjects = (<HTMLSelectElement>event.srcElement).value
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Subject', label: this.filterSubjects}})
    }
    this.currentParams['subject'] = this.filterSubjects
    this.setQueryString()
    return this.filterSubjects
  }

  setTopics(event: any) {
    this.contentLoading = true
    let paramTopics: any = (_.isUndefined(this.currentParams.topics)) ? [] : this.currentParams.topics.split(',')
    if (!_.isUndefined(event.preventDefault)) {
      event.preventDefault()
      if (event.target.checked) {
        if (_.indexOf(paramTopics, event.target.value) === -1) {
          paramTopics.push(event.target.value)
        }
      } else {
        paramTopics.splice(_.indexOf(paramTopics, event.target.value), 1)
      }
    } else {
      paramTopics = event.split(',')
    }
    if (paramTopics.length === 0) {
      return this.clearTopics(null)
    }
    this.category = []
      _.each(this.categories, (category) => {
        _.each(category.topics, (topic) => {
          _.each(paramTopics, (paramTopic) => {
            if (topic.slug === paramTopic) {
              topic.active = true
              this.topics = category.topics
              this.topics = _.sortBy(category.topics, 'label')
              category.active = true
              this.category.push(category)
              let patch: any = {}
              patch[topic.name] = true
              this.filter.patchValue(patch)
            }
          })
        })
      })
      _.each(this.topics, (topic) => {
        topic.active = false
        _.each(paramTopics, (paramTopic) => {
          if (topic.slug === paramTopic) {
            topic.active = true
          }
        })
      })
      this.currentParams['topics'] = paramTopics.join()
      delete this.currentParams.category

    if (_.findIndex(this.topics, { 'active': true}) === -1) {
      _.each(this.topics, (topic) => {
        topic.active = false
      })
    }
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Topics', label: this.currentParams['topics']}})
    }
    this.setQueryString()
  }

  displayTopics(event: any) {
    let value: any = event
    if (!_.isUndefined(event.preventDefault)) {
      event.preventDefault()
      value = event.target.id
    }
    this.topics.length = 0
    this.category = _.filter(this.categories, {name: value})
    this.currentCategory = this.category[0].slug
    this.currentCategoryString = this.category[0].label
    this.topics = _.sortBy(this.category[0].topics, 'label')
    _.each(this.categories, (category) => {
      let toClear: any = {}
      toClear[category.name] = ''
      this.filter.patchValue(toClear)
      category.active = false
    })
    _.each(this.topics, (topic) => {
      let toClear: any = {}
      toClear[topic.name] = ''
      this.filter.patchValue(toClear)
      topic.active = false
    })
    this.currentParams['category'] = this.category[0].slug
    delete this.currentParams['topics']
    if (isPlatformBrowser(this.platformId)) {
      this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Category', label: this.currentParams['category']}})
    }
    this.setQueryString()

    this.category[0].active = true
    let toSet: any = {}
    toSet[value] = true
    this.filter.patchValue(toSet)
    _.each(this.topics, (topic) => {
      topic.active = false
    })
  }

  checkboxesActive(data: any) {
    return (_.findIndex(data, { 'active': true}) !== -1) ? true : false
  }

  filterActive() {
    return (this.filter.value.term || this.filterSubjects !== 'All' || _.findIndex(this.types, { 'active': true}) !== -1 || _.findIndex(this.keystages, { 'active': true}) !== -1 || this.category !== null ) ? true : false
  }

  subjectsActive(subject: any) {
    return (subject !== 'All') ? true : false
  }

  isActive(collection: any) {
    let isActive = false
    _.each(collection, (item) => {
      if (item.active === true) {
        isActive = true
      }
    })
    return isActive
  }

  toggleFilter(event: any) {
    event.preventDefault()
    if (event.target.tagName === 'SPAN') {
      return
    }
    let parent: any = event.target.parentElement.parentElement
    if (parent.classList) {
      parent.classList.toggle('collapsed')
    } else {
      let classes: any = parent.className.split(' ')
      let i: any = classes.indexOf('collapsed')
      if (i >= 0) {
        classes.splice(i, 1)
      } else {
        classes.push('collapsed')
        parent.className = classes.join()
      }
    }
  }

  showFilter(event: any) {
    event.preventDefault()
    let parent: any = event.target.parentElement.parentElement
    event.target.innerHTML = (event.target.innerHTML === 'Show') ? 'Hide' : 'Show'

    if (parent.classList) {
      parent.classList.toggle('show')
    } else {
      let classes: any = parent.className.split(' ')
      let i: any = classes.indexOf('show')
      if (i >= 0) {
        classes.splice(i, 1)
      } else {
        classes.push('show')
        parent.className = classes.join(' ')
      }
    }
  }
}
