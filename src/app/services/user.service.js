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
import { AuthHttp } from 'angular2-jwt';
var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.addToList = function (list, id) {
        this.http.post('https://www.truetube.co.uk/v5/api/me/' + list + '/' + id, {})
            .subscribe(function (data) {
            if (data['message'] = 'item added') {
                return true;
            }
        });
    };
    UserService.prototype.removeFromList = function (list, id) {
        this.http.delete('https://www.truetube.co.uk/v5/api/me/' + list + '/' + id)
            .subscribe(function (data) {
            if (data['message'] = 'item removed') {
                return true;
            }
        });
    };
    UserService.prototype.removeList = function (list) {
        this.http.delete('https://www.truetube.co.uk/v5/api/me/' + list)
            .subscribe(function (data) {
            if (data['message'] = 'item removed') {
                return true;
            }
        });
    };
    return UserService;
}());
UserService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthHttp])
], UserService);
export { UserService };
//# sourceMappingURL=user.service.js.map