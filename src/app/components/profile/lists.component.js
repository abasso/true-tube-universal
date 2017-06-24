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
import * as _ from 'lodash';
import { AuthHttp } from 'angular2-jwt';
import { ActivatedRoute, Router } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
var UserListsComponent = (function () {
    function UserListsComponent(route, router, http, angulartics2GoogleAnalytics, angulartics2) {
        var _this = this;
        this.route = route;
        this.router = router;
        this.http = http;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.deleteDialogTitle = 'Delete this list?';
        this.message = '';
        this.confirmClicked = false;
        this.cancelClicked = false;
        this.lockBlur = false;
        this.lists = [];
        this.notificationMessage = '';
        this.showNotification = false;
        this.notificationRemove = false;
        this.menu = [
            {
                label: 'Profile',
                url: '/me',
                css: ''
            },
            {
                label: 'Lists',
                url: '/me/lists',
                css: 'icon icon-small icon-list icon-left'
            },
            {
                label: 'Favourites',
                url: '/me/list/favourites',
                css: 'icon icon-small icon-favourite icon-left'
            }
        ];
        route.data.subscribe(function (data) {
            _this.profile = data['profile'];
            _.each(_this.profile.lists, function (list, key) {
                var listObject = {
                    key: key,
                    title: list['title'],
                    titleWithCount: list['title'] + ' (' + list['items'].length + ' Item' + ((list['items'].length > 1) ? 's' : '') + ')',
                    canDelete: true,
                    url: '/me/list/' + key
                };
                if (key.toString() === 'favourites') {
                    listObject.canDelete = false;
                    _this.lists.unshift(listObject);
                }
                else {
                    _this.lists.push(listObject);
                }
            });
        });
    }
    UserListsComponent.prototype.toggleNotification = function (list) {
        var _this = this;
        this.notificationRemove = true;
        this.notificationMessage = 'Removed ' + list;
        this.showNotification = true;
        setTimeout(function () {
            _this.showNotification = false;
        }, 3000);
    };
    UserListsComponent.prototype.highlightRow = function (event, list) {
        event.preventDefault();
        _.each(this.lists, function (item) {
            if (item.title === list) {
                item.removing = true;
            }
        });
    };
    UserListsComponent.prototype.unHighlightRow = function (list) {
        _.each(this.lists, function (item) {
            if (item.title === list) {
                item.removing = false;
            }
        });
    };
    UserListsComponent.prototype.navigate = function (event) {
        this.router.navigateByUrl(event);
    };
    UserListsComponent.prototype.removeList = function (event, key) {
        var _this = this;
        this.http.delete('https://www.truetube.co.uk/v5/api/me/' + key).subscribe(function (data) {
            _.each(_this.lists, function (item) {
                if (item.key === key) {
                    item.removed = true;
                    _this.toggleNotification(item.title);
                }
            });
            setTimeout(function () {
                _.remove(_this.lists, { 'key': key });
            }, 200);
        });
    };
    return UserListsComponent;
}());
UserListsComponent = __decorate([
    Component({
        selector: 'app-lists',
        templateUrl: './lists.component.html'
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        Router,
        AuthHttp,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], UserListsComponent);
export { UserListsComponent };
//# sourceMappingURL=lists.component.js.map