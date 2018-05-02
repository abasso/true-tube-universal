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
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { Auth } from './../../../services/auth.service'

var RmAuthComponent = (function () {
    function RmAuthComponent(http, router) {
        this.http = http;
        this.router = router;
        this.url = 'https://www.truetube.co.uk/v5/api/checkauth';
    }
    RmAuthComponent.prototype.ngOnInit = function () {
        var _this = this;
        return this.http.get(this.url)
            .map(function (r) { return r.json(); })
            .subscribe(function (success) {
            if (success.authenticated) {
                localStorage.setItem('rmlogin', success.token);
                localStorage.setItem('token', success.token);
                let redirectUrl: string = ''
                redirectUrl = localStorage.getItem('redirectUrl')
                Auth.lock.getProfile(success.token, (error: any, profile: any) => {
                  if (error) {
                    return console.log("THERE WAS AN ERROR GETTING THE USER DATA FOR AN RM USER", error)
                  }
                  localStorage.setItem('profile', JSON.stringify(profile))
                  Auth.userProfile = profile
                  ga('set', 'userId', profile.user_id)
                })
                Auth.loggedInStatus.next('update')
                if (redirectUrl) {
                  _.this.router.navigate([redirectUrl])
                } else {
                  _.this.router.navigate(['/me'])
                }
            }
            else {
                _this.router.navigate(['/']);
            }
        }, function (error) {
            _this.router.navigate(['/']);
            return true;
        });
    };
    return RmAuthComponent;
}());
RmAuthComponent = __decorate([
    Component({
        selector: 'app-rm-auth',
        templateUrl: './rm-auth.html'
    }),
    __metadata("design:paramtypes", [Http, Router])
], RmAuthComponent);
export { RmAuthComponent };
//# sourceMappingURL=rm-auth.component.js.map
