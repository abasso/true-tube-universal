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
import { DataService } from './../../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
import * as _ from 'lodash';
import { isPlatformBrowser } from '@angular/common';
var ItemPageComponent = (function () {
    function ItemPageComponent(platformId, dataService, route, angulartics2GoogleAnalytics, angulartics2) {
        this.platformId = platformId;
        this.dataService = dataService;
        this.route = route;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.content = [];
        this.gridSize = 'grid-row';
    }
    ItemPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.param = this.route.url.subscribe(function (url) {
            _this.currentId = url[url.length - 1].path;
            _this.dataService.itemPages(_this.currentId)
                .subscribe(function (data) {
                if (isPlatformBrowser(_this.platformId)) {
                    window.scrollTo(0, 0);
                }
                if (data._source.grid_size !== 3) {
                    _this.gridSize = (data._source.grid_size === 4) ? 'grid-row-four' : (data._source.grid_size === 2) ? 'grid-row-two' : 'list-row';
                }
                _this.content.push(data._source);
                _.each(_this.content, function (content) {
                    _.each(content.items, function (item) {
                        if (item.link) {
                            item.cleanLink = item.link.split('/')[2];
                        }
                    });
                });
            });
        });
    };
    return ItemPageComponent;
}());
ItemPageComponent = __decorate([
    Component({
        selector: 'app-item-page',
        templateUrl: './item-page.component.html'
    }),
    __param(0, Inject(PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        DataService,
        ActivatedRoute,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], ItemPageComponent);
export { ItemPageComponent };
//# sourceMappingURL=item-page.component.js.map