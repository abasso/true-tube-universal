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
import { ListingComponent } from './list.component';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import * as Cookies from 'js-cookie';
var ListingSortComponent = (function () {
    function ListingSortComponent(ListingComponent, route, router, location) {
        var _this = this;
        this.ListingComponent = ListingComponent;
        this.route = route;
        this.router = router;
        this.location = location;
        this.firstPage = true;
        this.lastPage = false;
        this.itemsPerPage = [
            '12',
            '24',
            '48',
            'All'
        ];
        this.route.queryParams
            .subscribe(function (params) {
            _this.currentParams = _.assign({}, params);
        });
        this.ListingComponent.currentPage
            .subscribe(function (page) {
            _this.setPage({ target: { value: page } }, null);
        });
        this.setListDisplay((_.isUndefined(Cookies.get('list-display'))) ? 'grid' : Cookies.get('list-display'));
        this.ListingComponent.paginationData.itemsPerPageCurrent = (_.isUndefined(Cookies.get('items-per-page'))) ? this.itemsPerPage[0] : Cookies.get('items-per-page');
        this.ListingComponent.paginationData.pages = [];
        this.ListingComponent.paginationData.totalPages = Math.ceil(this.ListingComponent.paginationData.totalItems / this.ListingComponent.paginationData.itemsPerPageCurrent);
        this.firstPage = (this.currentParams.page === '1' || _.isUndefined(this.currentParams.page) || this.ListingComponent.paginationData.currentPage === 1) ? true : false;
        this.lastPage = (this.currentParams.page === this.ListingComponent.paginationData.currentPage) ? true : false;
        for (var i = 0; i < this.ListingComponent.paginationData.totalPages; i++) {
            this.ListingComponent.paginationData.pages.push(i + 1);
        }
        this.pages = this.ListingComponent.paginationData.pages;
        this.loadMoreCount = 12;
    }
    ListingSortComponent.prototype.setPage = function (event, arg) {
        if (arg === 'next') {
            event.preventDefault();
            if (this.ListingComponent.paginationData.currentPage === this.ListingComponent.paginationData.totalPages - 1) {
                return;
            }
            event.target.value = ++this.ListingComponent.paginationData.currentPage;
        }
        if (arg === 'prev') {
            event.preventDefault();
            if (this.ListingComponent.paginationData.currentPage === 0) {
                return;
            }
            event.target.value = --this.ListingComponent.paginationData.currentPage;
        }
        this.ListingComponent.paginationData.currentPage = event.target.value;
        var appendedQuery = '';
        var pageNumber = parseInt(event.target.value);
        this.firstPage = (pageNumber === 0) ? true : false;
        this.lastPage = (pageNumber === this.ListingComponent.paginationData.totalPages - 1) ? true : false;
        var hasPage = false;
        pageNumber++;
        var pageNumberString = pageNumber.toString();
        _.each(this.currentParams, function (value, key) {
            if (key === 'page') {
                hasPage = true;
                value = pageNumberString;
            }
            if (value.length) {
                appendedQuery += key + '=' + value.trim() + '&';
            }
        });
        if (!hasPage) {
            appendedQuery += 'page=' + pageNumberString;
        }
        this.location.replaceState('/list?' + appendedQuery);
    };
    ListingSortComponent.prototype.setItemsPerPage = function (event) {
        event.preventDefault();
        Cookies.set('items-per-page', event.target.value);
        this.ListingComponent.paginationData.itemsPerPageCurrent = event.target.value;
        this.ListingComponent.paginationData.totalPages = Math.ceil(this.ListingComponent.paginationData.totalItems / this.ListingComponent.paginationData.itemsPerPageCurrent);
        this.ListingComponent.paginationData.pages = [];
        for (var i = 0; i < this.ListingComponent.paginationData.totalPages; i++) {
            this.ListingComponent.paginationData.pages.push(i + 1);
        }
        this.pages = this.ListingComponent.paginationData.pages;
        this.ListingComponent.paginationData.currentPage = 0;
    };
    ListingSortComponent.prototype.setListDisplay = function (type) {
        Cookies.set('list-display', type);
        this.ListingComponent.displayGrid = (type === 'grid') ? true : false;
        this.ListingComponent.displayList = (type === 'list') ? true : false;
    };
    ListingSortComponent.prototype.listDisplayClick = function (event, type) {
        event.preventDefault();
        this.setListDisplay(type);
    };
    ListingSortComponent.prototype.loadMore = function (event) {
        event.preventDefault();
        this.loadMoreCount = this.loadMoreCount + 12;
        this.ListingComponent.paginationData.itemsPerPageCurrent = this.loadMoreCount;
    };
    return ListingSortComponent;
}());
ListingSortComponent = __decorate([
    Component({
        selector: 'listing-sort',
        templateUrl: './sort.component.html'
    }),
    __metadata("design:paramtypes", [ListingComponent,
        ActivatedRoute,
        Router,
        Location])
], ListingSortComponent);
export { ListingSortComponent };
//# sourceMappingURL=sort.component.js.map