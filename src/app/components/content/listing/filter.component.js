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
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingComponent } from './list.component';
import { DataService } from './../../../services/data.service';
import { Categories } from './../../../definitions/categories';
import { Subjects } from './../../../definitions/subjects';
import { ContentTypes } from './../../../definitions/content-types';
import { KeyStages } from './../../../definitions/key-stages';
import { ListService } from './../../../services/list.service';
import { Angulartics2 } from 'angulartics2';

import { isPlatformBrowser } from '@angular/common';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
var ListFilterComponent = (function () {
    function ListFilterComponent(platformId, listService, route, router, ListingComponent, dataService, location, formBuilder, angulartics2GoogleAnalytics, angulartics2) {
        var _this = this;
        this.platformId = platformId;
        this.listService = listService;
        this.route = route;
        this.router = router;
        this.ListingComponent = ListingComponent;
        this.dataService = dataService;
        this.location = location;
        this.formBuilder = formBuilder;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.contentLoading = true;
        this.topics = [];
        this.categories = Categories;
        this.types = ContentTypes;
        this.subjects = Subjects;
        this.keystages = KeyStages;
        this.category = null;
        this.itemsTotal = 0;
        this.itemsTotalLabel = 'Items';
        listService.pathToReset$.subscribe(function (query) {
            _this.route.queryParams
                .subscribe(function (params) {
                _this.currentParams = _.assign({}, params);
            });
        });
        var formElements = {
            term: '',
            subject: '',
            category: ''
        };
        _.each(this.types, function (type) {
            formElements[type.name] = '';
        });
        _.each(this.keystages, function (keystage) {
            formElements[keystage.name] = '';
        });
        _.each(this.categories, function (category) {
            formElements[category.name] = '';
            _.each(category.topics, function (topic) {
                formElements[topic.name] = '';
            });
        });
        this.filter = formBuilder.group(formElements);
        this.route.queryParams
            .subscribe(function (params) {
            _this.currentParams = _.assign({}, params);
        });
        this.types = ContentTypes;
    }
    ListFilterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.filterSubjects = 'All';
        this.filter.patchValue({ subject: 'All' });
        this.ListingComponent.data = this.filter.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(function (data) { return _this.dataService.search(data, _this.types, _this.keystages, _this.filterSubjects, _this.topics, _this.category); });
        this.items = this.ListingComponent.data.subscribe(function (data) {
            _this.contentLoading = false;
            _this.ListingComponent.paginationData.totalItems = data.hits.hits.length;
            _this.ListingComponent.itemCount = data.hits.total;
            _this.ListingComponent.items = data.hits.hits;
            _.each(_this.ListingComponent.items, function (item) {
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
            _.each(data.hits.hits, function (item) {
                if (_.findIndex(item._source.embedded, { 'advisory': '1' }) !== -1) {
                    item.advisory = true;
                }
                item.typesCount = _.countBy(item._source.embedded, 'type');
                item.contenttypes = [];
                _.each(item.typesCount, function (type, key) {
                    var typestring = key.replace('_', ' ');
                    if (_.findIndex(_this.types, { 'term': key }) !== -1) {
                        item.contenttypes.push({ 'label': typestring, 'class': 'btn-' + key.replace('_', '-'), 'query': { 'tab': key } });
                    }
                });
            });
            if (_.isUndefined(_this.currentItemCount)) {
                _this.currentItemCount = _this.ListingComponent.itemCount;
            }
            _this.updateTotal(_this.currentItemCount, _this.ListingComponent.itemCount);
            _this.ListingComponent.resetPagination();
        });
        this.route.queryParams
            .map(function (params) { return params['content types']; })
            .subscribe(function (types) {
            if (!_.isUndefined(types)) {
                _this.resetFilterState(_this.types);
                var typeArray_1 = types.split(',');
                _.each(typeArray_1, function (type) {
                    if (typeArray_1.length === 1) {
                        _this.currentType = {
                            'tab': _.trim(type, 's')
                        };
                    }
                    else {
                        _this.currentType = {};
                    }
                    var pathType = _.find(_this.types, { slug: type });
                    pathType.active = true;
                    var patch = {};
                    patch[pathType.name] = true;
                    _this.filter.patchValue(patch);
                });
            }
            else {
                _this.clearTypes(null);
            }
        });
        this.route.queryParams
            .map(function (params) { return params['keystages']; })
            .subscribe(function (keystages) {
            if (!_.isUndefined(keystages)) {
                _this.resetFilterState(_this.keystages);
                var keyArray = keystages.split(',');
                _.each(keyArray, function (key) {
                    var pathKeys = _.find(_this.keystages, { slug: key });
                    pathKeys.active = true;
                    var patch = {};
                    patch[pathKeys.name] = true;
                    _this.filter.patchValue(patch);
                });
            }
            else {
                _this.clearKeystages(null);
            }
        });
        this.route.queryParams
            .map(function (params) { return params['search']; })
            .subscribe(function (search) {
            if (!_.isUndefined(search)) {
                _this.filter.patchValue({ term: search });
            }
            else {
                _this.clearTerm(null);
            }
        });
        this.route.queryParams
            .map(function (params) { return params['topics']; })
            .subscribe(function (topics) {
            if (!_.isUndefined(topics)) {
                _this.setTopics(topics);
            }
            else {
                _this.clearTopics(null);
            }
        });
        this.route.queryParams
            .map(function (params) { return params['category']; })
            .subscribe(function (category) {
            if (_this.currentCategory === category) {
                return;
            }
            if (!_.isUndefined(category)) {
                _this.category = _.filter(_this.categories, { slug: category });
                _this.displayTopics(_this.category[0].name);
            }
            else {
                if (_.findIndex(_this.topics, { active: true }) === -1) {
                    _this.clearCategory();
                }
            }
        });
        this.route.queryParams
            .map(function (params) { return params['subject']; })
            .subscribe(function (subject) {
            if (!_.isUndefined(subject)) {
                var sub = _.find(_this.subjects, { slug: subject });
                _this.currentParams['subject'] = sub.slug;
                _this.filterSubjects = sub.label;
                _this.filter.patchValue({ subject: sub.slug });
            }
            else {
                _this.clearSubject(null);
            }
        });
    };
    ListFilterComponent.prototype.querySubscription = function () {
        var _this = this;
        this.route.queryParams
            .subscribe(function (params) {
            _this.currentParams = _.assign({}, params);
        });
    };
    ListFilterComponent.prototype.resetFilterState = function (filter) {
        var _this = this;
        _.each(filter, function (item) {
            item.active = false;
            _this.filter.patchValue({ name: null });
        });
    };
    ListFilterComponent.prototype.updateTotal = function (currentCount, newCount) {
        var _this = this;
        var countSpeed = 3;
        var difference = currentCount - newCount;
        if (this.itemsTotal > newCount) {
            countSpeed = (difference > 400) ? 81 : (difference > 200) ? 21 : 11;
        }
        else {
            countSpeed = (difference < 400) ? 81 : (difference < 200) ? 21 : 11;
        }
        if (countSpeed === 0) {
            countSpeed = 1;
        }
        if (currentCount === newCount) {
            countSpeed = currentCount;
        }
        var loop = function () {
            if (_this.itemsTotal > newCount) {
                _this.itemsTotal -= countSpeed;
                if (_this.itemsTotal <= newCount) {
                    _this.itemsTotal = _this.ListingComponent.itemCount;
                    _this.currentItemCount = _this.ListingComponent.itemCount;
                    _this.itemsTotalLabel = (newCount > 1) ? 'Items' : 'Item';
                }
                else {
                    requestAnimationFrame(loop);
                }
            }
            else {
                _this.itemsTotal += countSpeed;
                if (_this.itemsTotal >= newCount) {
                    _this.itemsTotal = _this.ListingComponent.itemCount;
                    _this.currentItemCount = _this.ListingComponent.itemCount;
                    _this.itemsTotalLabel = (newCount > 1) ? 'Items' : 'Item';
                }
                else {
                    requestAnimationFrame(loop);
                }
            }
        };
        loop();
    };
    ListFilterComponent.prototype.search = function (event) {
        var _this = this;
        var searchTimeout;
        clearTimeout(searchTimeout);
        this.contentLoading = true;
        if (event.key === 'Enter') {
            return;
        }
        searchTimeout = setTimeout(function () {
            _this.currentParams['search'] = event.target.value;
            if (isPlatformBrowser(_this.platformId)) {
                _this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Search', label: event.target.value } });
            }
            _this.setQueryString();
            _this.ListingComponent.resetPagination();
        }, 500);
    };
    ListFilterComponent.prototype.clearTerm = function (event) {
        this.contentLoading = true;
        this.filter.patchValue({ term: '' });
        delete this.currentParams.search;
        if (event !== null) {
            if (isPlatformBrowser(this.platformId)) {
                this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear Term' } });
            }
            event.preventDefault();
            this.setQueryString();
        }
    };
    ListFilterComponent.prototype.clearSubject = function (event) {
        this.contentLoading = true;
        this.filter.patchValue({ subject: 'All' });
        this.filterSubjects = 'All';
        delete this.currentParams.subject;
        if (event !== null) {
            if (isPlatformBrowser(this.platformId)) {
                this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear Subject' } });
            }
            event.preventDefault();
            this.setQueryString();
        }
    };
    ListFilterComponent.prototype.clearCategory = function () {
        var _this = this;
        this.category = null;
        _.each(this.categories, function (category) {
            var toClear = {};
            toClear[category.name] = '';
            _this.filter.patchValue(toClear);
            category.active = false;
        });
        if (isPlatformBrowser(this.platformId)) {
            this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear Category' } });
        }
        delete this.currentParams.category;
        this.setQueryString();
    };
    ListFilterComponent.prototype.clearCategoryAndTopics = function (event) {
        var _this = this;
        this.contentLoading = true;
        this.category = null;
        _.each(this.topics, function (topic) {
            var toClear = {};
            toClear[topic.name] = '';
            _this.filter.patchValue(toClear);
            topic.active = false;
        });
        _.each(this.categories, function (category) {
            var toClear = {};
            toClear[category.name] = '';
            _this.filter.patchValue(toClear);
            category.active = false;
        });
        delete this.currentParams.category;
        if (event !== null) {
            if (isPlatformBrowser(this.platformId)) {
                this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear Category and Topics' } });
            }
            event.preventDefault();
            this.setQueryString();
        }
    };
    ListFilterComponent.prototype.clearTopics = function (event) {
        var _this = this;
        // if (_.isUndefined(this.currentParams.category)) return
        this.contentLoading = true;
        _.each(this.topics, function (topic) {
            var toClear = {};
            toClear[topic.name] = '';
            _this.filter.patchValue(toClear);
            topic.active = false;
        });
        if (this.category !== null) {
            this.currentParams.category = this.category[0].slug;
        }
        delete this.currentParams.topics;
        if (event !== null) {
            if (isPlatformBrowser(this.platformId)) {
                this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Topics Clear' } });
            }
            event.preventDefault();
            this.setQueryString();
        }
    };
    ListFilterComponent.prototype.clearTypes = function (event) {
        var _this = this;
        this.contentLoading = true;
        this.currentType = {};
        _.each(this.types, function (type) {
            var toClear = {};
            toClear[type.name] = '';
            _this.filter.patchValue(toClear);
            type.active = false;
        });
        delete this.currentParams['content types'];
        this.resetFilterState(this.types);
        if (event !== null) {
            if (isPlatformBrowser(this.platformId)) {
                this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Types Clear' } });
            }
            event.preventDefault();
            this.setQueryString();
        }
    };
    ListFilterComponent.prototype.clearKeystages = function (event) {
        this.contentLoading = true;
        delete this.currentParams.keystages;
        this.resetFilterState(this.keystages);
        if (event !== null) {
            if (isPlatformBrowser(this.platformId)) {
                this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Keystages Clear' } });
            }
            event.preventDefault();
            this.setQueryString();
        }
    };
    ListFilterComponent.prototype.clearAll = function (event) {
        if (event !== null) {
            event.preventDefault();
            if (isPlatformBrowser(this.platformId)) {
                this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Clear All' } });
            }
        }
        this.contentLoading = true;
        this.clearSubject(event);
        this.clearCategoryAndTopics(event);
        this.clearTopics(event);
        this.clearTypes(event);
        this.clearKeystages(event);
        this.clearTerm(event);
    };
    ListFilterComponent.prototype.setFilter = function (event, value) {
        if (!_.isUndefined(event)) {
            event.preventDefault();
        }
        this.contentLoading = true;
        var filterQuery = (_.isUndefined(this.currentParams[value.type])) ? [] : this.currentParams[value.type].split(',');
        if (value.active) {
            filterQuery.splice(_.indexOf(filterQuery, value.slug), 1);
            value.active = false;
            this.filter.patchValue({ value: false });
        }
        else {
            filterQuery.push(value.slug);
            value.active = true;
            this.filter.patchValue({ value: true });
        }
        this.currentParams[value.type] = filterQuery.join();
        if (isPlatformBrowser(this.platformId)) {
            this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter ' + _.capitalize(value.type), label: this.currentParams[value.type] } });
        }
        this.setQueryString();
    };
    ListFilterComponent.prototype.setQueryString = function () {
        var appendedQuery = '';
        var hasPage = false;
        _.each(this.currentParams, function (value, key) {
            if (key === 'page') {
                hasPage = true;
                appendedQuery += 'page=1&';
            }
            else if (value.length) {
                appendedQuery += key + '=' + value.trim() + '&';
            }
        });
        if (!hasPage) {
            appendedQuery += '&page=1';
        }
        this.router.navigateByUrl('/list?' + appendedQuery);
    };
    ListFilterComponent.prototype.setSubject = function (event) {
        this.contentLoading = true;
        this.filterSubjects = event.srcElement.value;
        if (isPlatformBrowser(this.platformId)) {
            this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Subject', label: this.filterSubjects } });
        }
        this.currentParams['subject'] = this.filterSubjects;
        this.setQueryString();
        return this.filterSubjects;
    };
    ListFilterComponent.prototype.setTopics = function (event) {
        var _this = this;
        this.contentLoading = true;
        var paramTopics = (_.isUndefined(this.currentParams.topics)) ? [] : this.currentParams.topics.split(',');
        if (!_.isUndefined(event.preventDefault)) {
            event.preventDefault();
            if (event.target.checked) {
                if (_.indexOf(paramTopics, event.target.value) === -1) {
                    paramTopics.push(event.target.value);
                }
            }
            else {
                paramTopics.splice(_.indexOf(paramTopics, event.target.value), 1);
            }
        }
        else {
            paramTopics = event.split(',');
        }
        if (paramTopics.length === 0) {
            return this.clearTopics(null);
        }
        this.category = [];
        _.each(this.categories, function (category) {
            _.each(category.topics, function (topic) {
                _.each(paramTopics, function (paramTopic) {
                    if (topic.slug === paramTopic) {
                        topic.active = true;
                        _this.topics = category.topics;
                        _this.topics = _.sortBy(category.topics, 'label');
                        category.active = true;
                        _this.category.push(category);
                        var patch = {};
                        patch[topic.name] = true;
                        _this.filter.patchValue(patch);
                    }
                });
            });
        });
        _.each(this.topics, function (topic) {
            topic.active = false;
            _.each(paramTopics, function (paramTopic) {
                if (topic.slug === paramTopic) {
                    topic.active = true;
                }
            });
        });
        this.currentParams['topics'] = paramTopics.join();
        delete this.currentParams.category;
        if (_.findIndex(this.topics, { 'active': true }) === -1) {
            _.each(this.topics, function (topic) {
                topic.active = false;
            });
        }
        if (isPlatformBrowser(this.platformId)) {
            this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Topics', label: this.currentParams['topics'] } });
        }
        this.setQueryString();
    };
    ListFilterComponent.prototype.displayTopics = function (event) {
        var _this = this;
        var value = event;
        if (!_.isUndefined(event.preventDefault)) {
            event.preventDefault();
            value = event.target.id;
        }
        this.topics.length = 0;
        this.category = _.filter(this.categories, { name: value });
        this.currentCategory = this.category[0].slug;
        this.currentCategoryString = this.category[0].label;
        this.topics = _.sortBy(this.category[0].topics, 'label');
        _.each(this.categories, function (category) {
            var toClear = {};
            toClear[category.name] = '';
            _this.filter.patchValue(toClear);
            category.active = false;
        });
        _.each(this.topics, function (topic) {
            var toClear = {};
            toClear[topic.name] = '';
            _this.filter.patchValue(toClear);
            topic.active = false;
        });
        this.currentParams['category'] = this.category[0].slug;
        delete this.currentParams['topics'];
        if (isPlatformBrowser(this.platformId)) {
            this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Filter Category', label: this.currentParams['category'] } });
        }
        this.setQueryString();
        this.category[0].active = true;
        var toSet = {};
        toSet[value] = true;
        this.filter.patchValue(toSet);
        _.each(this.topics, function (topic) {
            topic.active = false;
        });
    };
    ListFilterComponent.prototype.checkboxesActive = function (data) {
        return (_.findIndex(data, { 'active': true }) !== -1) ? true : false;
    };
    ListFilterComponent.prototype.filterActive = function () {
        return (this.filter.value.term || this.filterSubjects !== 'All' || _.findIndex(this.types, { 'active': true }) !== -1 || _.findIndex(this.keystages, { 'active': true }) !== -1 || this.category !== null) ? true : false;
    };
    ListFilterComponent.prototype.subjectsActive = function (subject) {
        return (subject !== 'All') ? true : false;
    };
    ListFilterComponent.prototype.isActive = function (collection) {
        var isActive = false;
        _.each(collection, function (item) {
            if (item.active === true) {
                isActive = true;
            }
        });
        return isActive;
    };
    ListFilterComponent.prototype.toggleFilter = function (event) {
        event.preventDefault();
        if (event.target.tagName === 'SPAN') {
            return;
        }
        var parent = event.target.parentElement.parentElement;
        if (parent.classList) {
            parent.classList.toggle('collapsed');
        }
        else {
            var classes = parent.className.split(' ');
            var i = classes.indexOf('collapsed');
            if (i >= 0) {
                classes.splice(i, 1);
            }
            else {
                classes.push('collapsed');
                parent.className = classes.join();
            }
        }
    };
    ListFilterComponent.prototype.showFilter = function (event) {
        event.preventDefault();
        var parent = event.target.parentElement.parentElement;
        event.target.innerHTML = (event.target.innerHTML === 'Show') ? 'Hide' : 'Show';
        if (parent.classList) {
            parent.classList.toggle('show');
        }
        else {
            var classes = parent.className.split(' ');
            var i = classes.indexOf('show');
            if (i >= 0) {
                classes.splice(i, 1);
            }
            else {
                classes.push('show');
                parent.className = classes.join(' ');
            }
        }
    };
    return ListFilterComponent;
}());
ListFilterComponent = __decorate([
    Component({
        selector: 'app-filter',
        templateUrl: './filter.component.html'
    }),
    __param(0, Inject(PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        ListService,
        ActivatedRoute,
        Router,
        ListingComponent,
        DataService,
        Location,
        FormBuilder,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], ListFilterComponent);
export { ListFilterComponent };
//# sourceMappingURL=filter.component.js.map