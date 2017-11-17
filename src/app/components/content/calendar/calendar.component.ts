import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { DataService } from './../../../services/data.service'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs/Rx'
import { AnalyticsService } from './../../../services/analytics.service'
import * as moment from 'moment'
import * as _ from 'lodash'

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styles: []
})
export class CalendarComponent implements OnInit {
  public currentDate: any = moment()
  public currentMonth: any = this.currentDate.month()
  public currentYear: any = this.currentDate.year()
  public selectedMonth: any = new BehaviorSubject(moment().month())
  public activeMonth: any = this.currentDate.month()
  public monthMin: any = this.currentDate.subtract(12, 'months')
  public monthMax: any = this.currentDate.add(12, 'months')
  public selectedMonthString: string
  public month: any
  public data: any
  public subscriber: any
  public noEvents = true
  public items: any[] = []
  public weeks: any[] = []
  public toHighlight = ''
  public eventCount: number
  public eventCountString: string
  public calendarLoaded = false
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public analyticsService: AnalyticsService
  ) {
    this.weeks.length = 42
    this.month = this.selectedMonth.subscribe(
      (month: any) => {
        this.activeMonth = month
        this.currentYear = this.currentDate.year()
        this.currentYear = (month > 11) ? ++this.currentYear : (month < 0) ? --this.currentYear : this.currentYear
        this.selectedMonthString = (this.currentMonth === month) ? 'This Month' : moment().month(month).format('MMMM') + ' ' + this.currentYear
        this.data = this.dataService.events(month)
        this.subscriber = this.data.subscribe(
          (data: any) => {
            if (isPlatformBrowser(this.platformId)) {
              window.scrollTo(0, 0)
            }
            if (month > 11) {
              month = month - 12
            } else if (month < 0) {
              month = month + 12
            }
            // Build the calendar days
            this.eventCount = 0
            let days: any[] = []
            let selectedMonth: any = moment({y: this.currentYear, M: month})
            let currentMonthStartDay: any = selectedMonth.startOf('month').day() + 1
            let previousMonthEndDate: any = moment({y: this.currentYear, M: month}).subtract(1, 'months').daysInMonth()
            let startDateOffset: number = previousMonthEndDate - currentMonthStartDay + 1
            let monthStart = 1
            let nextMonthStart = 1
            let monthSwitch = false
            for (let i = 0; i <= 41; i++) {
              // The month starts on Sunday - the first day on the calendar
              if (currentMonthStartDay === 1) {
                // Add this months days
                if (monthStart <= selectedMonth.daysInMonth()) {
                  days.splice(i, 0, {
                    day: monthStart++,
                    month: selectedMonth.month()
                  })
                  // Add next months days
                } else {
                  days.splice(i, 0, {
                    day: nextMonthStart++,
                    month: (month === 11) ? 0 : selectedMonth.month() + 1,
                    year: (month === 11) ? ++this.currentYear : this.currentYear,
                    css: 'other-month next-month'
                  })
                }
              } else {
                // Add last months days
                if (startDateOffset < previousMonthEndDate) {
                  days.splice(i, 0, {
                    day: ++startDateOffset,
                    month: selectedMonth.month() - 1,
                    year: this.currentYear,
                    css: 'other-month previous-month'
                  })
                  // Add this months days
                } else if (monthStart <= selectedMonth.daysInMonth()) {
                  if (monthSwitch === false) {
                    days[i - 1].lastDayOfPreviousMonth = true
                    monthSwitch = true
                  }
                  days.splice(i, 0, {
                    day: monthStart++,
                    month: selectedMonth.month(),
                    year: this.currentYear
                  })
                  // Add next months days
                } else {
                  days.splice(i, 0, {
                    day: nextMonthStart++,
                    month: (month === 11) ? 0 : selectedMonth.month() + 1,
                    year: (month === 11) ? ++this.currentYear : this.currentYear,
                    css: 'other-month next-month'
                  })
                }
              }
            }
            this.items = _.sortBy(data.hits.hits, 'date').reverse()
            _.each(this.items, (item) => {
              if (moment(item._source.date.value).month() === selectedMonth.month() && moment(item._source.date.value).year() === selectedMonth.year()) {
                this.eventCount++
              }
            })
            this.eventCountString = (this.eventCount === 0) ? '(No Events)' : (this.eventCount > 1) ? '(' + this.eventCount + ' Events)' : '(' + this.eventCount + ' Event)'
            _.each(days, (day, dayIndex) => {
              day.events = []
              _.each(this.items, (event, index) => {
                event.startDate = moment(event._source.date.value)
                event.endDate = moment(event._source.date.end_value)
                event.title = event._source.title
                event.link = '/event/' + event._id
                let eventClone: any = _.clone(event)
                if (!_.isUndefined(days[dayIndex - 1]) && days[dayIndex - 1].events.length) {
                    let previousDay = _.find(days[dayIndex - 1].events, {title: event.title})
                    if (!_.isUndefined(previousDay)) {
                      event.index = previousDay['index']
                    }
                }
                if (day.day === event.startDate.date() && day.month === event.startDate.month() && day.year === event.startDate.year()) {
                  if (_.isUndefined(event.index)) {
                    if (day.events.length === 0) {
                      event.index = eventClone.index = 0
                    } else {
                      // Itterate over the existing events
                      _.each(day.events, (dayEvent) => {
                        // If there is an empty slot fill it with an event
                        if (_.isUndefined(dayEvent)) {
                          event.index = eventClone.index = event.index
                        } else {
                          // Otherwise make the slot the end of the array
                          event.index = eventClone.index = day.events.length
                        }
                      })
                    }
                  }
                  eventClone.css = ''
                  event.css = ''
                  if (!event.startDate.isSame(event.endDate)) {
                    eventClone.css += ' event-start'
                  }
                  let characterCount: number = event._source.title.length
                  if (characterCount > 20 && day.day % 7 === 0) {
                    eventClone.css += ' event-two-lines'
                    event.css += ' event-two-lines'
                    event.multiLine = eventClone.multiLine = true
                  }
                  if (characterCount > 40 && day.day % 7 === 0) {
                    eventClone.css = event.css += ' event-three-lines'
                    event.multiLine = eventClone.multiLine = true
                  }
                } else if (day.day === event.endDate.date() && day.month === event.endDate.month() && day.year === event.endDate.year()) {
                    eventClone.css += ' event-end'
                } else if (moment({M: day.month, d: day.day, y: day.year}).isBetween(event.startDate, event.endDate, 'day', '[]') && !moment(event.endDate).isSame(event.startDate)) {
                  eventClone.css += ' event-multi'
                }
                if (moment({M: day.month, d: day.day, y: day.year}).isBetween(event.startDate, event.endDate, 'day', '[]')) {
                  day.events[event.index] = eventClone
                }
              })

              _.each(day.events, (event: any, index: any, collection: any) => {
                if (_.isUndefined(event)) {
                  collection[index] = {
                    css: ' event-placeholder',
                    index: index,
                    _source: {}
                  }
                  collection[index]._source.title = ''
                }
              })
              day.events = _.sortBy(day.events, 'index')
            })
            this.weeks = _.chunk(days, 7)
            if (currentMonthStartDay <= 5) {
              this.weeks = _.dropRight(this.weeks, 1)
            }
            this.noEvents = (this.items.length) ? false : true
            if (this.items.length) {
              _.each(this.items, (item) => {
                item.date = moment(item._source.date).format('Do')
              })
            }
            this.calendarLoaded = true
            this.route.queryParams
            .map(params => params['month'])
            .subscribe((month) => {
              if (!_.isUndefined(month)) {
                this.setMonth(month)
              }
            })
          }
        )
      }
    )
  }

  ngOnInit() {
  }

  highlightEvent(event: any, index: any) {
    this.toHighlight = index
  }

  setMonth(month: string) {
    this.selectedMonth.next(month)
  }

  prevMonth(event: any) {
    event.preventDefault()
    let currentMonth: any = this.selectedMonth.getValue()
    if (currentMonth !== -6) {
      this.selectedMonth.next(currentMonth - 1)
    }
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsService.emitEvent("Calendar Prev", "Action", "", 1)
    }
  }

  nextMonth(event: any) {
    event.preventDefault()
    let currentMonth: any = this.selectedMonth.getValue()
    if (currentMonth !== 18) {
      this.selectedMonth.next(++currentMonth)
    }
    if (isPlatformBrowser(this.platformId)) {
      this.analyticsService.emitEvent("Calendar Next", "Action", "", 1)
    }
  }
}
