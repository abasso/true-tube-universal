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
import * as Cookies from 'js-cookie';
import * as _ from 'lodash';
import { Auth } from './../../services/auth.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
import { isPlatformBrowser } from '@angular/common';
var CallToActionComponent = (function () {
    function CallToActionComponent(platformId, auth, angulartics2GoogleAnalytics, angulartics2) {
        this.platformId = platformId;
        this.auth = auth;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.fontSize = 16;
        this.dyslexiaEnabled = false;
        this.dyslexiaLabel = 'Dyslexia Font';
    }
    CallToActionComponent.prototype.ngOnInit = function () {
        if (Cookies.get('dyslexia-font')) {
            this.setDyslexiaFont();
            this.dyslexiaEnabled = true;
            this.dyslexiaLabel = 'Standard Font';
        }
    };
    CallToActionComponent.prototype.toggleDyslexiaFont = function (event) {
        this.dyslexiaEnabled = (this.dyslexiaEnabled) ? false : true;
        this.dyslexiaLabel = (this.dyslexiaEnabled) ? 'Standard Font' : 'Dyslexia Font';
        if (isPlatformBrowser(this.platformId)) {
            this.angulartics2.eventTrack.next({ action: 'Action', properties: { category: 'Dyslexia Font', label: this.dyslexiaLabel } });
        }
        event.preventDefault();
        this.setDyslexiaFont();
        this.setDyslexiaCookie();
    };
    CallToActionComponent.prototype.setDyslexiaCookie = function () {
        if (_.isUndefined(Cookies.get('dyslexia-font'))) {
            Cookies.set('dyslexia-font', 'true');
        }
        else {
            Cookies.remove('dyslexia-font');
        }
    };
    CallToActionComponent.prototype.toggleSite = function (event) {
        event.preventDefault();
        Cookies.set('proxy_override', 'true');
        if (isPlatformBrowser(this.platformId)) {
            window.location.reload();
        }
    };
    CallToActionComponent.prototype.setDyslexiaFont = function () {
        if (isPlatformBrowser(this.platformId)) {
            var body = document.getElementsByTagName('body')[0];
            var className = 'dyslexia';
            if (body.classList) {
                body.classList.toggle(className);
            }
            else {
                var classes = body.className.split(' ');
                var existingIndex = classes.indexOf(className);
                if (existingIndex >= 0) {
                    classes.splice(existingIndex, 1);
                }
                else {
                    classes.push(className);
                    body.className = classes.join(' ');
                }
            }
        }
    };
    return CallToActionComponent;
}());
CallToActionComponent = __decorate([
    Component({
        selector: 'app-call-to-action',
        templateUrl: './call-to-action.component.html'
    }),
    __param(0, Inject(PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        Auth,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], CallToActionComponent);
export { CallToActionComponent };
//# sourceMappingURL=call-to-action.component.js.map