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
import { Auth } from './../../services/auth.service';
import { Angulartics2 } from 'angulartics2';

import { isPlatformBrowser } from '@angular/common';
var HeaderComponent = (function () {
    function HeaderComponent(platformId, auth, angulartics2GoogleAnalytics, angulartics2) {
        this.platformId = platformId;
        this.auth = auth;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.menuVisible = false;
    }
    HeaderComponent.prototype.ngOnInit = function () {
    };
    HeaderComponent.prototype.toggleMenu = function (event) {
        event.preventDefault();
        this.menuVisible = (this.menuVisible === false) ? true : false;
    };
    HeaderComponent.prototype.mobileSearch = function (event) {
        event.preventDefault();
        this.menuVisible = true;
        if (isPlatformBrowser(this.platformId)) {
            document.getElementById('search').focus();
        }
    };
    HeaderComponent.prototype.searchDone = function (event) {
        this.hideMenu();
        if (isPlatformBrowser(this.platformId)) {
            document.getElementById('search').blur();
        }
    };
    HeaderComponent.prototype.menuClick = function () {
        this.hideMenu();
    };
    HeaderComponent.prototype.hideMenu = function () {
        this.menuVisible = false;
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    Component({
        selector: 'app-header',
        templateUrl: './header.component.html'
    }),
    __param(0, Inject(PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        Auth,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], HeaderComponent);
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map