import { Component, OnInit } from '@angular/core'
import { DataService } from './../../services/data.service'
import { BehaviorSubject } from 'rxjs/Rx'
import * as moment from 'moment'
import * as _ from 'lodash'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'

@Component({
  selector: 'app-events-block',
  templateUrl: './events.component.html'
})
export class EventsBlockComponent implements OnInit {
  public currentTime: any = moment()
  public selectedMonth: any = new BehaviorSubject(moment().month())
  public selectedMonthString: string
  public month: any
  public data: any
  public subscriber: any
  public noEvents = true
  public items: any[] = []
  constructor(
    public dataService: DataService,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2

  ) {
    this.month = this.selectedMonth.subscribe(
      (month: any) => {
        this.selectedMonthString = (this.currentTime.month() === month) ? 'this month' : 'in ' + moment().month(month).format('MMMM')
        this.data = this.dataService.events(month)
        this.subscriber = this.data.subscribe(
          (data: any) => {
            this.items = _.sortBy(data.hits.hits, 'date').reverse()
            this.noEvents = (this.items.length) ? false : true
            if (this.items.length) {
              _.each(this.items, (item) => {
                item.url = '/event/' + item._id
                item.date = moment(item._source.date.value).format('Do')
              })
            }
          }
        )
      }
    )
  }

  ngOnInit() {
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
