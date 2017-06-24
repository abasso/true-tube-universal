var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { PLATFORM_ID, Component, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from './../../../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/Rx';
import * as moment from 'moment';
import * as _ from 'lodash';
var CalendarComponent = (function () {
    function CalendarComponent(platformId, dataService, route, router) {
        var _this = this;
        this.platformId = platformId;
        this.dataService = dataService;
        this.route = route;
        this.router = router;
        this.currentDate = moment();
        this.currentMonth = this.currentDate.month();
        this.selectedMonth = new BehaviorSubject(moment().month());
        this.noEvents = true;
        this.items = [];
        this.weeks = [];
        this.toHighlight = '';
        this.calendarLoaded = false;
        this.weeks.length = 42;
        this.month = this.selectedMonth.subscribe(function (month) {
            _this.selectedMonthString = (_this.currentMonth === month) ? 'This Month' : moment().month(month).format('MMMM');
            _this.data = _this.dataService.events();
            _this.subscriber = _this.data.subscribe(function (data) {
                if (isPlatformBrowser(_this.platformId)) {
                    window.scrollTo(0, 0);
                }
                // Build the calendar days
                _this.eventCount = 0;
                var days = [];
                var selectedMonth = moment({ 'M': month });
                var currentMonthStartDay = selectedMonth.startOf('month').day();
                var previousMonthEndDate = moment().month(month - 1).daysInMonth();
                var startDateOffset = previousMonthEndDate - currentMonthStartDay + 1;
                var monthStart = 1;
                var nextMonthStart = 1;
                var monthSwitch = false;
                for (var i = 0; i <= 41; i++) {
                    // The month starts on Sunday - the first day on the calendar
                    if (currentMonthStartDay === 1) {
                        // Add this months days
                        if (monthStart <= selectedMonth.daysInMonth()) {
                            days.splice(i, 0, {
                                day: monthStart++,
                                month: selectedMonth.month()
                            });
                            // Add next months days
                        }
                        else {
                            days.splice(i, 0, {
                                day: nextMonthStart++,
                                month: selectedMonth.month() + 1,
                                css: 'other-month next-month'
                            });
                        }
                    }
                    else {
                        // Add last months days
                        if (startDateOffset < previousMonthEndDate) {
                            days.splice(i, 0, {
                                day: ++startDateOffset,
                                month: selectedMonth.month() - 1,
                                css: 'other-month previous-month'
                            });
                            // Add this months days
                        }
                        else if (monthStart <= selectedMonth.daysInMonth()) {
                            if (monthSwitch === false) {
                                days[i - 1].lastDayOfPreviousMonth = true;
                                monthSwitch = true;
                            }
                            days.splice(i, 0, {
                                day: monthStart++,
                                month: selectedMonth.month(),
                            });
                            // Add next months days
                        }
                        else {
                            days.splice(i, 0, {
                                day: nextMonthStart++,
                                month: selectedMonth.month() + 1,
                                css: 'other-month next-month'
                            });
                        }
                    }
                }
                // Iterate over the events
                _this.items = _.sortBy(data.hits.hits, 'date').reverse();
                // Increment the events count for the title
                _.each(_this.items, function (item) {
                    if (moment(item._source.date.value).month() === selectedMonth.month() && moment(item._source.date.value).year() === selectedMonth.year()) {
                        _this.eventCount++;
                    }
                });
                _this.eventCountString = (_this.eventCount > 1) ? '(' + _this.eventCount + ' Events)' : '(' + _this.eventCount + ' Event)';
                _.each(days, function (day, dayIndex) {
                    day.events = [];
                    _.each(_this.items, function (event, index) {
                        event.startDate = moment(event._source.date.value);
                        event.endDate = moment(event._source.date.end_value);
                        event.title = event._source.title;
                        event.link = '/event/' + event._id;
                        var eventClone = _.clone(event);
                        if (!_.isUndefined(days[dayIndex - 1]) && days[dayIndex - 1].events.length) {
                            var previousDay = _.find(days[dayIndex - 1].events, { title: event.title });
                            if (!_.isUndefined(previousDay)) {
                                event.index = previousDay['index'];
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
                                    event.index = eventClone.index = 0;
                                }
                                else {
                                    // Itterate over the existing events
                                    _.each(day.events, function (dayEvent) {
                                        // If there is an empty slot fill it with an event
                                        if (_.isUndefined(dayEvent)) {
                                            event.index = eventClone.index = event.index;
                                        }
                                        else {
                                            // Otherwise make the slot the end of the array
                                            event.index = eventClone.index = day.events.length;
                                        }
                                    });
                                }
                            }
                            eventClone.css = '';
                            event.css = '';
                            if (!event.startDate.isSame(event.endDate)) {
                                eventClone.css += ' event-start';
                            }
                            var characterCount = event._source.title.length;
                            if (characterCount > 20 && day.day % 7 === 0) {
                                eventClone.css += ' event-two-lines';
                                event.css += ' event-two-lines';
                                event.multiLine = eventClone.multiLine = true;
                            }
                            if (characterCount > 40 && day.day % 7 === 0) {
                                eventClone.css = event.css += ' event-three-lines';
                                event.multiLine = eventClone.multiLine = true;
                            }
                            // Else if the day date is equal to the end date and the day month is the same as the event end month
                        }
                        else if (day.day === event.endDate.date() && day.month === event.endDate.month()) {
                            eventClone.css += ' event-end';
                        }
                        else if (moment({ M: day.month, d: day.day }).isBetween(event.startDate, event.endDate, 'day', '[]')) {
                            eventClone.css += ' event-multi';
                        }
                        if (moment({ M: day.month, d: day.day }).isBetween(event.startDate, event.endDate, 'day', '[]')) {
                            day.events[event.index] = eventClone;
                        }
                    });
                    _.each(day.events, function (event, index, collection) {
                        if (_.isUndefined(event)) {
                            collection[index] = {
                                css: ' event-placeholder',
                                index: index,
                                _source: {}
                            };
                            collection[index]._source.title = '';
                        }
                    });
                    day.events = _.sortBy(day.events, 'index');
                });
                _this.weeks = _.chunk(days, 7);
                if (currentMonthStartDay <= 5) {
                    _this.weeks = _.dropRight(_this.weeks, 1);
                }
                _this.noEvents = (_this.items.length) ? false : true;
                if (_this.items.length) {
                    _.each(_this.items, function (item) {
                        item.date = moment(item._source.date).format('Do');
                    });
                }
                _this.calendarLoaded = true;
                _this.route.queryParams
                    .map(function (params) { return params['month']; })
                    .subscribe(function (month) {
                    if (!_.isUndefined(month)) {
                        _this.setMonth(month);
                    }
                });
            });
        });
    }
    CalendarComponent.prototype.ngOnInit = function () {
    };
    CalendarComponent.prototype.highlightEvent = function (event, index) {
        this.toHighlight = index;
    };
    CalendarComponent.prototype.setMonth = function (month) {
        // moment({'M': month})
        this.selectedMonth.next(month);
    };
    CalendarComponent.prototype.prevMonth = function (event) {
        event.preventDefault();
        var currentMonth = this.selectedMonth.getValue();
        if (currentMonth !== 0) {
            this.selectedMonth.next(currentMonth - 1);
        }
    };
    CalendarComponent.prototype.nextMonth = function (event) {
        event.preventDefault();
        var currentMonth = this.selectedMonth.getValue();
        if (currentMonth !== 11) {
            this.selectedMonth.next(currentMonth + 1);
        }
    };
    return CalendarComponent;
}());
CalendarComponent = __decorate([
    Component({
        selector: 'app-calendar',
        templateUrl: './calendar.component.html',
        styles: []
    }),
    __param(0, Inject(PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        DataService,
        ActivatedRoute,
        Router])
], CalendarComponent);
export { CalendarComponent };
//# sourceMappingURL=calendar.component.js.map