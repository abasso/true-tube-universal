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
import { PLATFORM_ID, Component, Output, EventEmitter, Inject } from '@angular/core';
import { ListFilterComponent } from './../content/listing/filter.component';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
// import {PopoverModule} from 'ngx-popover'
import { ContentTypes } from './../../definitions/content-types';
import { ListService } from './../../services/list.service';
import { ItemComponent } from './../content/item/item.component';
import { Auth } from './../../services/auth.service';
import * as _ from 'lodash';
import { isPlatformBrowser } from '@angular/common';
var PrimaryNavComponent = (function () {
    function PrimaryNavComponent(platformId, filter, listService, auth, angulartics2GoogleAnalytics, angulartics2
        // public popover: PopoverModule
    ) {
        this.platformId = platformId;
        this.filter = filter;
        this.listService = listService;
        this.auth = auth;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.searchSubmitted = new EventEmitter();
        this.menuClick = new EventEmitter();
        this.item = ItemComponent;
        this.items = _.filter(ContentTypes, { inMenu: true });
    }
    PrimaryNavComponent.prototype.ngOnInit = function () {
        this.item = ItemComponent;
    };
    PrimaryNavComponent.prototype.resetRootPath = function (event, query) {
        event.preventDefault();
        this.listService.resetCurrentPath(query);
        this.menuClick.emit(event);
    };
    PrimaryNavComponent.prototype.logout = function (event) {
        this.auth.logout(event);
        this.menuClick.emit(event);
    };
    PrimaryNavComponent.prototype.login = function (event) {
        this.auth.login(event);
        this.menuClick.emit(event);
    };
    PrimaryNavComponent.prototype.register = function (event) {
        this.auth.signup(event);
        this.menuClick.emit(event);
    };
    PrimaryNavComponent.prototype.profile = function (event) {
        this.auth.logout(event);
        this.menuClick.emit(event);
    };
    PrimaryNavComponent.prototype.searchDone = function (event) {
        if (isPlatformBrowser(this.platformId)) {
            this.angulartics2.eventTrack.next({ action: 'Search', properties: { category: 'Primary Nav', label: event.target.elements[0].value } });
        }
        this.searchSubmitted.emit(event);
    };
    return PrimaryNavComponent;
}());
__decorate([
    Output(),
    __metadata("design:type", Object)
], PrimaryNavComponent.prototype, "searchSubmitted", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PrimaryNavComponent.prototype, "menuClick", void 0);
PrimaryNavComponent = __decorate([
    Component({
        selector: 'app-primary-nav',
        templateUrl: './primary-nav.component.html'
    }),
    __param(0, Inject(PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        ListFilterComponent,
        ListService,
        Auth,
        Angulartics2GoogleAnalytics,
        Angulartics2
        // public popover: PopoverModule
    ])
], PrimaryNavComponent);
export { PrimaryNavComponent };
//# sourceMappingURL=primary-nav.component.js.map