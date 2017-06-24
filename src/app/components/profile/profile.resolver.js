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
import { Profile } from './profile.model';
import { AuthHttp } from 'angular2-jwt';
import { Http } from "@angular/http";
var ProfileResolver = (function () {
    function ProfileResolver(http, plainHttp) {
        this.http = http;
        this.plainHttp = plainHttp;
        // TODO: load this from injectable config object?
        this.profileUrl = 'https://www.truetube.co.uk/v5/api/me';
    }
    ProfileResolver.prototype.resolve = function (route, state) {
        if (!!localStorage.getItem('rmlogin')) {
            return this.plainHttp.get(this.profileUrl)
                .map(function (r) { return r.json(); })
                .map(Profile.hydrate);
        }
        return this.http.get(this.profileUrl)
            .map(function (r) { return r.json(); })
            .map(Profile.hydrate);
    };
    return ProfileResolver;
}());
ProfileResolver = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthHttp, Http])
], ProfileResolver);
export { ProfileResolver };
//# sourceMappingURL=profile.resolver.js.map