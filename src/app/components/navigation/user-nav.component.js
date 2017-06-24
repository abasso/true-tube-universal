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
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
var UserNavComponent = (function () {
    function UserNavComponent(route, router, angulartics2GoogleAnalytics, angulartics2) {
        this.route = route;
        this.router = router;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.menu = [
            {
                label: 'Profile',
                url: '/me',
                css: '',
                selected: false
            },
            {
                label: 'Lists',
                url: '/me/lists',
                css: 'icon icon-small icon-list icon-left',
                selected: false
            },
            {
                label: 'Favourites',
                url: '/me/list/favourites',
                css: 'icon icon-small icon-favourite icon-left',
                selected: false
            }
        ];
    }
    UserNavComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.url.subscribe(function (url) {
            if (url.length > 1) {
                _.each(_this.menu, function (menuItem) {
                    if (menuItem.label === _.capitalize(url[1].path)) {
                        menuItem.selected = true;
                    }
                });
            }
            else {
                _this.menu[0].selected = true;
            }
        });
    };
    UserNavComponent.prototype.navigate = function (event) {
        this.router.navigateByUrl(event);
    };
    return UserNavComponent;
}());
UserNavComponent = __decorate([
    Component({
        selector: 'app-user-nav',
        templateUrl: './user-nav.component.html',
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        Router,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], UserNavComponent);
export { UserNavComponent };
//# sourceMappingURL=user-nav.component.js.map