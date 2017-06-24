var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { DataService } from './../../services/data.service';
import { Auth } from './../../services/auth.service';
import { Headers } from '@angular/http';
var ProfileComponent = (function () {
    function ProfileComponent(http, route, auth, dataService) {
        var _this = this;
        this.http = http;
        this.route = route;
        this.auth = auth;
        this.dataService = dataService;
        this.showNotification = false;
        this.rmUnifyUser = false;
        this.notificationEmail = false;
        this.lists = [];
        this.menu = [
            {
                label: 'Profile',
                url: '/me',
                css: ''
            },
            {
                label: 'Lists',
                url: '/me/lists',
                css: 'icon icon-small icon-list icon-left'
            },
            {
                label: 'Favourites',
                url: '/me/list/favourites',
                css: 'icon icon-small icon-favourite icon-left'
            }
        ];
        route.data.subscribe(function (data) {
            _this.profile = data['profile'];
        });
    }
    ProfileComponent.prototype.setName = function (event) {
        this.profile.name = event.target.value;
    };
    ProfileComponent.prototype.passwordReminder = function () {
        var _this = this;
        var userProfile = JSON.parse(localStorage.getItem('profile'));
        var header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http
            .post('https://truetube.eu.auth0.com/dbconnections/change_password', {
            'client_id': 'c1OIvYBFmOpdrUgXuHGD5j3KE7rjFSJT',
            'email': userProfile['email'],
            'connection': 'Username-Password-Authentication'
        }, { headers: header })
            .subscribe(function (response) {
            if (response['status'] === 200) {
                _this.showNotification = true;
                _this.notificationMessage = 'Password change link sent';
                _this.notificationEmail = true;
                setTimeout(function () {
                    _this.showNotification = false;
                }, 3000);
            }
        });
    };
    ProfileComponent.prototype.update = function () {
        var _this = this;
        var header = new Headers();
        header.append('Content-Type', 'application/json');
        return this.http
            .post('https://www.truetube.co.uk/v5/api/me', {
            nickname: this.profile.name
        }, { headers: header })
            .subscribe(function (response) {
            _this.showNotification = true;
            _this.notificationMessage = 'User details updated.';
            _this.notificationEmail = true;
            setTimeout(function () {
                _this.showNotification = false;
            }, 3000);
        });
    };
    return ProfileComponent;
}());
__decorate([
    ViewChild('fileInput'),
    __metadata("design:type", ElementRef)
], ProfileComponent.prototype, "inputEl", void 0);
ProfileComponent = __decorate([
    Component({
        templateUrl: './profile.component.html'
    }),
    __metadata("design:paramtypes", [AuthHttp,
        ActivatedRoute,
        Auth,
        DataService])
], ProfileComponent);
export { ProfileComponent };
//# sourceMappingURL=profile.component.js.map