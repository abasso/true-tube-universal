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
import { DataService } from './../../../services/data.service';
import { UserService } from './../../../services/user.service';
import { AttributePipe } from './../../../pipes/attribute.pipe';
import { SanitiseUrlPipe } from './../../../pipes/sanitise-url.pipe';
import { ContentTypes } from './../../../definitions/content-types';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from './../../../services/auth.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import 'rxjs/add/operator/switchMap';
import { Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
import { isPlatformBrowser } from '@angular/common';
import { MetaService } from '@ngx-meta/core';
var ItemComponent = (function () {
    function ItemComponent(platformId, route, router, dataService, userService, location, auth, http, angulartics2GoogleAnalytics, angulartics2, meta) {
        this.platformId = platformId;
        this.route = route;
        this.router = router;
        this.dataService = dataService;
        this.userService = userService;
        this.location = location;
        this.auth = auth;
        this.http = http;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.meta = meta;
        this.item = {};
        this.showEmbed = false;
        this.embedButtonLabel = 'Copy';
        this.embedButtonClass = 'btn-video';
        this.embeddedContent = [];
        this.activeTab = 'film';
        this.hideAdvisory = false;
        this.addedToFavourites = false;
        this.showLists = false;
        this.play = false;
        this.enableSubtitles = false;
        this.createListTitle = '';
        this.addListError = false;
        this.addListErrorMessage = 'An error occured';
        this.listArray = [];
        this.listButtonClass = 'btn-lesson-plan';
        this.listButtonLabel = 'Create List &amp; Add';
        this.notificationMessage = '';
        this.showNotification = false;
        this.notificationRemove = false;
        this.notificationFavourite = false;
        this.apiUrl = 'https://www.truetube.co.uk/v5/api/me';
        this.advisoryMessage = '<p>This video may contain content <strong>unsuitable for sensitive or younger students.</strong> Teacher discretion is advised.</p>';
        this.paginationData = {
            currentPage: 0,
            itemsPerPage: 100000
        };
    }
    ItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.types = ContentTypes;
        this.data = this.route.url
            .switchMap(function (url) { return _this.dataService.itemBySlug(url); })
            .subscribe(function (data) {
            if (isPlatformBrowser(_this.platformId)) {
                window.scrollTo(0, 0);
            }
            _this.item = data.hits.hits[0]._source;
            var strippedDescription = _this.item.description.replace(/(<([^>]+)>)/ig, "");
            _this.meta.setTitle(_this.item.title);
            _this.meta.setTag('description', strippedDescription);
            _this.meta.setTag('og:url', 'https://www.truetube.co.uk' + _this.item.slug);
            _this.meta.setTag('og:image', _this.item.thumbnail[0].url);
            // this.meta.setTag('og:description', strippedDescription)
            // this.meta.setTag('og:title', this.item.title + " - True Tube")
            _this.embeddedContent = _.groupBy(_this.item.embedded, 'type');
            if (_this.item.resource_types.length === 1) {
                _this.item.hideMenu = true;
            }
            _.each(_this.item.embedded, function (embed) {
                if (embed === null) {
                    return;
                }
                if (embed.thumbnail === null) {
                    embed.thumbnail = _this.item.thumbnail;
                }
            });
            _.each(_this.item.related, function (item) {
                item.contenttypes = [];
                _.each(item.resource_types, function (type, key) {
                    if (_.findIndex(_this.types, { 'term': type.type }) !== -1) {
                        item.contenttypes.push({ 'label': type.label, 'class': 'btn-' + type.type.replace('_', '-'), 'query': { 'tab': type.type } });
                    }
                });
            });
            if (_this.auth.authenticated()) {
                _this.isItemInList();
            }
            _this.route.queryParams
                .map(function (params) { return params['tab']; })
                .subscribe(function (type) {
                if (!_.isUndefined(type)) {
                    _this.setActiveTab(type);
                }
                else {
                    _this.setActiveTab(_this.item.resource_types[0].type);
                }
            });
        });
        this.auth.loggedInStatus.subscribe(function (data) {
            _this.isItemInList();
        });
    };
    ItemComponent.prototype.hasAttributes = function (attribute) {
        return (_.isUndefined(attribute) || attribute === null || attribute === false || attribute.length === 0) ? false : true;
    };
    ItemComponent.prototype.navigateAttribute = function (event, type, attribute) {
        event.preventDefault();
        this.router.navigateByUrl('/list?' + type + '=' + attribute);
        if (isPlatformBrowser(this.platformId)) {
            this.angulartics2.eventTrack.next({ action: 'Navigate', properties: { category: 'Content Info ' + type, title: attribute } });
        }
    };
    ItemComponent.prototype.duration = function (seconds) {
        return moment('2017-01-01').startOf('day').seconds(seconds).format('mm:ss');
    };
    ItemComponent.prototype.age = function (seconds) {
        return moment.unix(seconds).fromNow();
    };
    ItemComponent.prototype.toggleEmbed = function (event) {
        event.preventDefault();
        return this.showEmbed = (this.showEmbed) ? false : true;
    };
    ItemComponent.prototype.setActiveTab = function (event) {
        event = event.replace(' ', '_');
        this.activeTab = event;
        if (isPlatformBrowser(this.platformId)) {
            this.angulartics2.eventTrack.next({ action: event, properties: { category: 'Content Tab', title: '' } });
        }
    };
    ItemComponent.prototype.tab = function (event) {
        this.router.navigateByUrl(this.item.slug + '?tab=' + event);
        this.hideAdvisory = false;
    };
    ItemComponent.prototype.embedCopySuccess = function (event) {
        var _this = this;
        this.embedButtonLabel = 'Copied';
        this.embedButtonClass = 'btn-success';
        setTimeout(function () {
            _this.embedButtonLabel = 'Copy';
            _this.embedButtonClass = 'btn-video';
        }, 1000);
    };
    ItemComponent.prototype.addToFavourites = function (event) {
        event.preventDefault();
        this.notificationFavourite = true;
        this.userService.addToList('favourites', this.item.id);
        _.find(this.listArray, function (listItem) {
            if (listItem.title === 'Favourites') {
                listItem.checked = true;
            }
        });
        this.toggleNotification('Favourites', true);
        this.addedToFavourites = true;
    };
    ItemComponent.prototype.removeFromFavourites = function (event) {
        event.preventDefault();
        this.notificationFavourite = true;
        this.userService.removeFromList('favourites', this.item.id);
        _.find(this.listArray, function (listItem) {
            if (listItem.title === 'Favourites') {
                listItem.checked = false;
            }
        });
        this.toggleNotification('Favourites', false);
        this.addedToFavourites = false;
    };
    ItemComponent.prototype.toggleLists = function (event) {
        event.preventDefault();
        if (this.showLists === true) {
            this.showLists = false;
        }
        else {
            this.showLists = true;
        }
    };
    ItemComponent.prototype.addList = function (event) {
        var _this = this;
        if (_.findIndex(this.listArray, function (list) {
            return list.title === _this.createListTitle;
        }) !== -1) {
            this.addListError = true;
            this.addListErrorMessage = 'A list with that name already exists';
            setTimeout(function () {
                _this.addListError = false;
            }, 3000);
        }
        else if (this.createListTitle !== '') {
            if (isPlatformBrowser(this.platformId)) {
                this.angulartics2.eventTrack.next({ action: 'Create', properties: { category: 'List', title: this.createListTitle } });
            }
            this.addListError = false;
            var listSlug = _.kebabCase(this.createListTitle);
            var header = new Headers();
            header.append('Content-Type', 'application/json');
            this.http.post(this.apiUrl + '/' + listSlug + '/' + this.item.id, {
                title: this.createListTitle
            }, { headers: header }).subscribe(function (data) {
                _this.listArray.push({
                    title: _this.createListTitle,
                    checked: true
                });
                _this.toggleNotification(_this.createListTitle, true);
                setTimeout(function () {
                    _this.createListTitle = '';
                }, 2200);
            });
        }
        else {
            this.addListError = true;
            this.addListErrorMessage = 'Please enter a list name';
            setTimeout(function () {
                _this.addListError = false;
            }, 3000);
        }
    };
    ItemComponent.prototype.toggleNotification = function (list, added) {
        var _this = this;
        this.showNotification = false;
        var message = 'Removed from ';
        if (added === false) {
            this.notificationRemove = true;
        }
        else {
            message = 'Added to ';
            this.notificationRemove = false;
        }
        this.notificationMessage = message + list;
        this.showNotification = true;
        setTimeout(function () {
            _this.showNotification = false;
        }, 3000);
    };
    ItemComponent.prototype.setList = function (event, key, title) {
        var _this = this;
        if (event.target.checked) {
            this.notificationFavourite = false;
            if (key === 'favourites') {
                this.addedToFavourites = true;
                this.notificationFavourite = true;
            }
            this.toggleNotification(title, true);
            this.http.post(this.apiUrl + '/' + key + '/' + this.item.id, {}).subscribe(function (data) {
                if (isPlatformBrowser(_this.platformId)) {
                    _this.angulartics2.eventTrack.next({ action: 'Add', properties: { category: 'List', title: _this.item.id } });
                }
            });
        }
        else {
            this.notificationFavourite = false;
            this.toggleNotification(title, false);
            if (key === 'favourites') {
                this.addedToFavourites = false;
                this.notificationFavourite = true;
            }
            this.http.delete(this.apiUrl + '/' + key + '/' + this.item.id).subscribe(function (data) {
                if (isPlatformBrowser(_this.platformId)) {
                    _this.angulartics2.eventTrack.next({ action: 'Remove', properties: { category: 'List', title: _this.item.id } });
                }
            });
        }
    };
    ItemComponent.prototype.keyCheck = function (event) {
        if (event.key === 'Enter') {
            this.addList(event);
        }
    };
    ItemComponent.prototype.playPlayer = function (event) {
        event.preventDefault();
        this.play = true;
        this.hideAdvisory = true;
    };
    ItemComponent.prototype.playSubtitlePlayer = function (event) {
        event.preventDefault();
        event.target.blur();
        this.play = true;
        this.hideAdvisory = true;
        this.enableSubtitles = true;
    };
    ItemComponent.prototype.isItemInList = function () {
        var _this = this;
        this.http.get(this.apiUrl)
            .subscribe(function (data) {
            _this.addedToFavourites = false;
            _this.userData = JSON.parse(data['_body']);
            _this.listArray = [];
            _.each(_this.userData.lists, function (list, key) {
                var arrayItem = {
                    title: list.title,
                    key: key,
                    checked: false,
                    order: 1
                };
                _.each(list.items, function (listItem) {
                    if (listItem === _this.item.id && list.title === 'Favourites') {
                        arrayItem.checked = true;
                        _this.addedToFavourites = true;
                        arrayItem.order = 0;
                    }
                    else if (listItem === _this.item.id) {
                        arrayItem.checked = true;
                        _this.listTitle = list.title;
                    }
                });
                _this.listArray.push(arrayItem);
            });
        });
    };
    return ItemComponent;
}());
ItemComponent = __decorate([
    Component({
        selector: 'app-item',
        templateUrl: './item.component.html',
        providers: [
            AttributePipe,
            SanitiseUrlPipe
        ]
    }),
    __param(0, Inject(PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        ActivatedRoute,
        Router,
        DataService,
        UserService,
        Location,
        Auth,
        AuthHttp,
        Angulartics2GoogleAnalytics,
        Angulartics2,
        MetaService])
], ItemComponent);
export { ItemComponent };
//# sourceMappingURL=item.component.js.map