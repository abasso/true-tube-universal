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
import * as _ from 'lodash';
import { isPlatformBrowser } from '@angular/common';
var PageComponent = (function () {
    function PageComponent(platformId, dataService, route) {
        this.platformId = platformId;
        this.dataService = dataService;
        this.route = route;
    }
    PageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.param = this.route.url.subscribe(function (url) {
            if (isPlatformBrowser(_this.platformId)) {
                window.scrollTo(0, 0);
            }
            var path = '/';
            _.each(url, function (urlPart) {
                path += urlPart.path + '/';
            });
            path = _.trimEnd(path, '/');
            _this.currentId = path;
            _this.route.params
                .switchMap(function () {
                return _this.dataService.menus();
            })
                .subscribe(function (data) {
                _this.menu = data._source.items;
            });
            _this.dataService.pages()
                .subscribe(function (data) {
                _.each(data.hits.hits, function (item) {
                    item.slug = item._source.slug;
                });
                _this.content = _.filter(data.hits.hits, { slug: _this.currentId });
            });
        });
    };
    return PageComponent;
}());
PageComponent = __decorate([
    Component({
        selector: 'app-page',
        templateUrl: './page.component.html'
    }),
    __param(0, Inject(PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        DataService,
        ActivatedRoute])
], PageComponent);
export { PageComponent };
//# sourceMappingURL=page.component.js.map