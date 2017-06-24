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
import * as _ from 'lodash';
import * as Cookies from 'js-cookie';
var CookieNoticeComponent = (function () {
    function CookieNoticeComponent() {
        this.cookieSet = true;
    }
    CookieNoticeComponent.prototype.ngOnInit = function () {
        this.cookieSet = (_.isUndefined(Cookies.get('cookie-notice'))) ? false : true;
    };
    CookieNoticeComponent.prototype.setCookie = function (event) {
        event.preventDefault();
        this.cookieSet = true;
        Cookies.set('cookie-notice', 'True', { expires: 365 });
    };
    return CookieNoticeComponent;
}());
CookieNoticeComponent = __decorate([
    Component({
        selector: 'app-cookie-notice',
        templateUrl: './cookie-notice.component.html'
    }),
    __metadata("design:paramtypes", [])
], CookieNoticeComponent);
export { CookieNoticeComponent };
//# sourceMappingURL=cookie-notice.component.js.map