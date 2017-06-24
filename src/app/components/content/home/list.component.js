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
import { PaginationPipe } from './../../../pipes/pagination.pipe';
import { BehaviorSubject } from 'rxjs/Rx';
import { DataService } from './../../../services/data.service';
import { ListService } from './../../../services/list.service';
import { Categories } from './../../../definitions/categories';
import { ContentTypes } from './../../../definitions/content-types';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
import * as _ from 'lodash';
var HomeListingComponent = (function () {
    function HomeListingComponent(dataService, listService, angulartics2GoogleAnalytics, angulartics2) {
        this.dataService = dataService;
        this.listService = listService;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.displayGrid = true;
        this.displayList = false;
        this.loadMoreCount = 12;
        this.categories = Categories;
        this.sortBy = new BehaviorSubject('created');
        this.contentLoading = true;
        this.paginationData = {
            currentPage: 0,
            itemsPerPage: 6,
            totalPages: 3,
            totalItems: 0,
            pages: [],
            itemsPerPageCurrent: 9
        };
    }
    HomeListingComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sortBy
            .subscribe(function (sortData) {
            _this.data = _this.dataService.list(sortData, 200);
            _this.data.subscribe(function (data) {
                _.each(data.hits.hits, function (item) {
                    item.typesCount = _.countBy(item._source.embedded, 'type');
                    item.contenttypes = [];
                    _.each(item.typesCount, function (type, key) {
                        _.each(ContentTypes, function (contentType) {
                            if (contentType.term === key) {
                                var typestring = (type > 1) ? key.replace('_', ' ') + 's' : key.replace('_', ' ');
                                item.contenttypes.push({ 'label': typestring, 'class': 'btn-' + key.replace('_', '-'), 'query': { 'tab': key } });
                            }
                        });
                    });
                });
                _this.items = data.hits.hits;
                _.each(_this.items, function (item) {
                    item._source.description = _this.dataService.trimDescription(item._source.description);
                    if (_.endsWith(item._source.description, '...')) {
                        item.readMore = true;
                    }
                    _.each(_this.categories, function (category) {
                        _.each(category.topics, function (subCategory) {
                            _.each(item._source.topic, function (topic) {
                                if (topic === subCategory.label) {
                                    item._source.category = category;
                                }
                            });
                        });
                    });
                });
                _this.contentLoading = false;
            });
        });
    };
    HomeListingComponent.prototype.sort = function (event, sortBy) {
        event.preventDefault();
        this.sortBy.next(sortBy);
        this.paginationData.itemsPerPageCurrent = 12;
    };
    HomeListingComponent.prototype.loadMore = function (event) {
        event.preventDefault();
        this.loadMoreCount = this.loadMoreCount + 12;
        this.paginationData.itemsPerPageCurrent = this.loadMoreCount;
    };
    HomeListingComponent.prototype.resetPagination = function () {
        // setTimeout(() => {
        this.paginationData.pages = [];
        this.paginationData.totalPages = Math.ceil(this.paginationData.totalItems / this.paginationData.itemsPerPageCurrent);
        for (var i = 0; i < this.paginationData.totalPages; i++) {
            this.paginationData.pages.push(i + 1);
        }
        this.paginationData.currentPage = 0;
        // }, 1)
    };
    return HomeListingComponent;
}());
HomeListingComponent = __decorate([
    Component({
        selector: 'home-list',
        templateUrl: './list.component.html',
        providers: [
            PaginationPipe,
            ListService
        ]
    }),
    __metadata("design:paramtypes", [DataService,
        ListService,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], HomeListingComponent);
export { HomeListingComponent };
//# sourceMappingURL=list.component.js.map