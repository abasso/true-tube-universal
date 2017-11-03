var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { Headers, RequestOptions } from '@angular/http';
var DataService = (function () {
    function DataService(http, authHttp) {
        this.http = http;
        this.authHttp = authHttp;
        this.baseUrl = 'https://www.truetube.co.uk/v5/api/';
        this.searchUrl = this.baseUrl + 'resources/_search';
        this.meUrl = this.baseUrl + 'me';
        this.feedBackUrl = this.baseUrl + 'feedback';
        this.tempUrl = this.baseUrl + 'resources/resource';
        this.carouselUrl = this.baseUrl + 'carousels/homepage/_search?sort=weight:asc';
        this.menuUrl = this.baseUrl + 'menus/menu/pages';
        this.eventsUrl = this.baseUrl + 'events/_search?sort=date.value:desc';
        this.pagesUrl = this.baseUrl + 'pages/_search';
        this.itemPageUrl = this.baseUrl + 'item_pages/page';
    }
    DataService.prototype.search = function (data, types, keys, subject, topics, category, limit) {
        if (limit === void 0) { limit = 1000; }
        var termArray = [];
        if (data.term) {
            termArray.push(encodeURIComponent(data.term));
        }
        if (_.findLastIndex(types, { 'active': true }) !== -1) {
            var typeString_1 = '(embedded.type:"';
            _.each(types, function (type, index) {
                if (type.active === true) {
                    typeString_1 += type.term;
                    if (types.length > 1 && parseInt(index) !== _.findLastIndex(types, { 'active': true })) {
                        typeString_1 += '" AND "';
                    }
                    if (parseInt(index) === _.findLastIndex(types, { 'active': true })) {
                        typeString_1 += '")';
                    }
                }
            });
            termArray.push(typeString_1);
        }
        if (_.findLastIndex(keys, { 'active': true }) !== -1) {
            var keyString_1 = '(keystage:"';
            _.each(keys, function (key, index) {
                if (key.active === true) {
                    keyString_1 += key.term;
                    if (keys.length > 1 && parseInt(index) !== _.findLastIndex(keys, { 'active': true })) {
                        keyString_1 += '" AND "';
                    }
                    if (parseInt(index) === _.findLastIndex(keys, { 'active': true })) {
                        keyString_1 += '")';
                    }
                }
            });
            termArray.push(keyString_1);
        }
        var topicArray = [];
        if (topics.length && category) {
            var topicString_1 = '(topic:"';
            _.each(topics, function (topic, index) {
                if (topic.active === true) {
                    topicArray.push(topic.label);
                }
            });
            var count = _.countBy(topics, 'active');
            if (count.false === topics.length) {
                _.each(topics, function (topic, index) {
                    topicArray.push(topic.label);
                });
            }
            _.each(topicArray, function (topic, index) {
                topicString_1 += topic;
                // let count: number = topicArray.length
                // let numberIndex: number = parseInt(index)
                if (topicArray.length > 1 && index !== topicArray.length) {
                    topicString_1 += '" OR "';
                }
                if (parseInt(index) === topicArray.length - 1) {
                    topicString_1 += '")';
                }
            });
            termArray.push(topicString_1);
        }
        if (_.isString(subject) && subject !== 'All') {
            termArray.push('(subjects:"' + subject + '")');
        }
        var termString = (termArray.length) ? termArray.join(' AND ') : '';
        var search = new URLSearchParams();
        if (termString !== '') {
            search.set('q', termString);
        }
        search.set('size', limit);
        return this.http
            .get(this.searchUrl, { search: search })
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.list = function (sort, limit) {
        if (sort === void 0) { sort = 'created'; }
        if (limit === void 0) { limit = 1000; }
        var search = new URLSearchParams();
        if (sort) {
            search.set('sort', sort + ':desc');
        }
        search.set('size', limit);
        return this.http
            .get(this.searchUrl, { search: search })
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.item = function (uri) {
        var itemUrl = this.tempUrl + '/' + uri.split('?')[0];
        itemUrl = itemUrl.split('%3F')[0];
        return this.http
            .get(itemUrl)
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.itemBySlug = function (slug, limit) {
        if (slug === void 0) { slug = null; }
        if (limit === void 0) { limit = 1; }
        var slugString = '';
        _.each(slug, function (part) {
            var cleanedPath = part.path.split('?')[0];
            slugString += '/' + cleanedPath;
        });
        var search = new URLSearchParams();
        search.set('q', 'slug:"' + slugString + '"');
        return this.http
            .get(this.searchUrl, { search: search })
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.userList = function (uri) {
        var itemUrl = this.meUrl + '/' + uri.split('?')[0];
        return this.authHttp
            .get(itemUrl)
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.updateUser = function (data) {
        var header = new Headers();
        var options = new RequestOptions({ headers: header });
        header.append('Content-Type', 'multipart/form-data');
        return this.authHttp
            .post(this.meUrl, data, options)
            .subscribe(function (response) { return (response.json()); });
    };
    DataService.prototype.sendFeedback = function (data) {
        var jsonData = JSON.stringify(data);
        var header = new Headers();
        var options = new RequestOptions({ headers: header });
        header.append('Content-Type', 'application/json');
        return this.http
            .post(this.feedBackUrl, jsonData, options)
            .subscribe(function (response) { return (console.log(response)); });
    };
    DataService.prototype.carousel = function () {
        return this.http
            .get(this.carouselUrl)
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.menus = function () {
        return this.http
            .get(this.menuUrl)
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.events = function (month) {
        if (month === void 0) { month = null; }
        var search = new URLSearchParams();
        if (month !== null) {
            var monthStart = moment({ M: month }).format('YYYY-MM-DD');
            var monthEnd = moment({ M: month, D: moment({ M: month }).daysInMonth() }).format('YYYY-MM-DD');
            search.set('q', 'date.value:[' + monthStart + ' TO ' + monthEnd + ']');
        }
        search.set('size', '1000');
        return this.http
            .get(this.eventsUrl, { search: search })
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.pages = function (page) {
        if (page === void 0) { page = null; }
        var search = new URLSearchParams();
        if (page !== null) {
            search.set('q', 'slug:' + page);
        }
        return this.http
            .get(this.pagesUrl, { search: search })
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.itemPages = function (page) {
        if (page === void 0) { page = null; }
        return this.http
            .get(this.itemPageUrl + '/' + page, {})
            .map(function (response) { return (response.json()); });
    };
    DataService.prototype.duration = function (seconds) {
        return moment('2017-01-01').startOf('day').seconds(seconds).format('mm:ss');
    };
    DataService.prototype.trimDescription = function (description) {
        var descriptionArray = description.split(' ');
        if (descriptionArray.length > 38) {
            descriptionArray.length = 38;
        }
        return (descriptionArray.length < 38) ? description : descriptionArray.join(' ') + '...';
    };
    return DataService;
}());
DataService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http,
        AuthHttp])
], DataService);
export { DataService };
//# sourceMappingURL=data.service.js.map
