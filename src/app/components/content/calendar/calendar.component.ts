import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'
import { DataService } from './../../../services/data.service'
import { ActivatedRoute, Router } from '@angular/router'
import { BehaviorSubject } from 'rxjs/Rx'
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
  public selectedMonth: any = new BehaviorSubject(moment().month())
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
    private router: Router
  ) {
    this.weeks.length = 42
    this.month = this.selectedMonth.subscribe(
      (month: any) => {
        this.selectedMonthString = (this.currentMonth === month) ? 'This Month' : moment().month(month).format('MMMM')
        this.data = this.dataService.events()
        this.subscriber = this.data.subscribe(
          (data: any) => {
            if (isPlatformBrowser(this.platformId)) {
              window.scrollTo(0, 0)
            }
            // Build the calendar days
            this.eventCount = 0
            let days: any[] = []
            let selectedMonth: any = moment({'M': month})
            let currentMonthStartDay: any = selectedMonth.startOf('month').day()
            let previousMonthEndDate: any = moment().month(month - 1).daysInMonth()
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
                    month: selectedMonth.month() + 1,
                    css: 'other-month next-month'
                  })
                }
              } else {
                // Add last months days
                if (startDateOffset < previousMonthEndDate) {
                  days.splice(i, 0, {
                    day: ++startDateOffset,
                    month: selectedMonth.month() - 1,
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
                  })
                  // Add next months days
                } else {
                  days.splice(i, 0, {
                    day: nextMonthStart++,
                    month: selectedMonth.month() + 1,
                    css: 'other-month next-month'
                  })
                }
              }
            }
            // Iterate over the events
            this.items = _.sortBy(data.hits.hits, 'date').reverse()
            // Increment the events count for the title
            _.each(this.items, (item) => {
              if (moment(item._source.date.value).month() === selectedMonth.month() && moment(item._source.date.value).year() === selectedMonth.year()) {
                this.eventCount++
              }
            })
            this.eventCountString = (this.eventCount > 1) ? '(' + this.eventCount + ' Events)' : '(' + this.eventCount + ' Event)'
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
                if (day.day === event.startDate.date() && day.month === event.startDate.month()) {


                  // if (days[dayIndex - 1].events.length > 0) {
                  //   console.log(_.find(days[dayIndex - 1].events, {title: event.title}))
                  //   // let previousDay = _.find(days[dayIndex - 1].events, {title: event.title})
                  //   // if (!_.isUndefined(previousDay)) {
                  //   //   event.index = previousDay.index
                  //   // }
                  // }

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
                  // Else if the day date is equal to the end date and the day month is the same as the event end month
                } else if (day.day === event.endDate.date() && day.month === event.endDate.month()) {
                    eventClone.css += ' event-end'
                } else if (moment({M: day.month, d: day.day}).isBetween(event.startDate, event.endDate, 'day', '[]')) {
                  eventClone.css += ' event-multi'
                }
                if (moment({M: day.month, d: day.day}).isBetween(event.startDate, event.endDate, 'day', '[]')) {
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
    // moment({'M': month})
    this.selectedMonth.next(month)
  }

  prevMonth(event: any) {
    event.preventDefault()
    let currentMonth: any = this.selectedMonth.getValue()
    if (currentMonth !== 0) {
      this.selectedMonth.next(currentMonth - 1)
    }
  }

  nextMonth(event: any) {
    event.preventDefault()
    let currentMonth: any = this.selectedMonth.getValue()
    if (currentMonth !== 11) {
      this.selectedMonth.next(currentMonth + 1)
    }
  }
}
