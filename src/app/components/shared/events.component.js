var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { DataService } from './../../services/data.service';
import { BehaviorSubject } from 'rxjs/Rx';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Angulartics2 } from 'angulartics2';

var EventsBlockComponent = (function () {
    function EventsBlockComponent(dataService, angulartics2GoogleAnalytics, angulartics2) {
        var _this = this;
        this.dataService = dataService;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.currentTime = moment();
        this.selectedMonth = new BehaviorSubject(moment().month());
        this.noEvents = true;
        this.items = [];
        this.month = this.selectedMonth.subscribe(function (month) {
            _this.selectedMonthString = (_this.currentTime.month() === month) ? 'this month' : 'in ' + moment().month(month).format('MMMM');
            _this.data = _this.dataService.events(month);
            _this.subscriber = _this.data.subscribe(function (data) {
                _this.items = _.sortBy(data.hits.hits, 'date').reverse();
                _this.noEvents = (_this.items.length) ? false : true;
                if (_this.items.length) {
                    _.each(_this.items, function (item) {
                        item.url = '/event/' + item._id;
                        item.date = moment(item._source.date.value).format('Do');
                    });
                }
            });
        });
    }
    EventsBlockComponent.prototype.ngOnInit = function () {
    };
    EventsBlockComponent.prototype.prevMonth = function (event) {
        event.preventDefault();
        var currentMonth = this.selectedMonth.getValue();
        if (currentMonth !== 0) {
            this.selectedMonth.next(currentMonth - 1);
        }
    };
    EventsBlockComponent.prototype.nextMonth = function (event) {
        event.preventDefault();
        var currentMonth = this.selectedMonth.getValue();
        if (currentMonth !== 11) {
            this.selectedMonth.next(currentMonth + 1);
        }
    };
    return EventsBlockComponent;
}());
EventsBlockComponent = __decorate([
    Component({
        selector: 'app-events-block',
        templateUrl: './events.component.html'
    }),
    __metadata("design:paramtypes", [DataService,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], EventsBlockComponent);
export { EventsBlockComponent };
//# sourceMappingURL=events.component.js.map