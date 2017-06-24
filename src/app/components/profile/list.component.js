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
import { ActivatedRoute } from '@angular/router';
import { DataService } from './../../services/data.service';
import { AuthHttp } from 'angular2-jwt';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
import * as _ from 'lodash';
var UserListComponent = (function () {
    function UserListComponent(route, dataService, http, angulartics2GoogleAnalytics, angulartics2) {
        var _this = this;
        this.route = route;
        this.dataService = dataService;
        this.http = http;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.lists = [];
        this.items = [];
        this.message = '';
        this.notificationMessage = '';
        this.showNotification = false;
        this.notificationRemove = false;
        this.embeddedContent = [];
        this.data = this.route.params
            .switchMap(function (params) { return _this.dataService.userList(params['id']); })
            .subscribe(function (data) {
            _this.data = data;
            _this.items = data.items;
            _this.route.params
                .map(function (params) { return params['id']; })
                .subscribe(function (id) {
                _this.id = id;
                _this.deleteDialogTitle = 'Remove from ' + data.title + '?';
                _this.title = data.title + ' (' + _this.items.length + ' Item' + ((_this.items.length > 1) ? 's' : '') + ')';
            });
            _.each(_this.items, function (item) {
                item.contenttypes = [];
                _.each(item.resource_types, function (resource) {
                    item.contenttypes.push({ 'label': resource.label, 'class': 'btn-' + resource.type.replace('_', '-'), 'query': { 'tab': resource.type }, 'slug': item.slug + '?tab=' + resource.type });
                });
            });
        });
    }
    UserListComponent.prototype.toggleNotification = function (item) {
        var _this = this;
        this.notificationRemove = true;
        this.notificationMessage = 'Removed ' + item;
        this.showNotification = true;
        setTimeout(function () {
            _this.showNotification = false;
        }, 3000);
    };
    UserListComponent.prototype.highlightRow = function (event, list) {
        event.preventDefault();
        _.each(this.items, function (item) {
            if (item.title === list) {
                item.removing = true;
            }
        });
    };
    UserListComponent.prototype.unHighlightRow = function (list) {
        _.each(this.items, function (item) {
            if (item.title === list) {
                item.removing = false;
            }
        });
    };
    UserListComponent.prototype.removeItem = function (event, key) {
        var _this = this;
        this.http.delete('https://www.truetube.co.uk/v5/api/me/' + this.id + '/' + key).subscribe(function (data) {
            _.each(_this.items, function (item) {
                if (item.id === key) {
                    item.removed = true;
                    _this.toggleNotification(item.title);
                }
            });
            setTimeout(function () {
                _.remove(_this.items, { 'id': key });
                _this.title = _this.data.title + ' (' + _this.items.length + ' Item' + ((_this.items.length > 1) ? 's' : '') + ')';
            }, 200);
        });
    };
    return UserListComponent;
}());
UserListComponent = __decorate([
    Component({
        selector: 'app-list',
        templateUrl: './list.component.html'
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        DataService,
        AuthHttp,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], UserListComponent);
export { UserListComponent };
//# sourceMappingURL=list.component.js.map