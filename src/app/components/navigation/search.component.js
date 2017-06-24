var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
var SearchComponent = (function () {
    function SearchComponent(router) {
        this.router = router;
        this.searchSubmitted = new EventEmitter();
        this.searchText = '';
        this.focussed = false;
    }
    SearchComponent.prototype.focus = function () {
        this.focussed = true;
    };
    SearchComponent.prototype.blur = function () {
        if (this.searchText === '') {
            this.focussed = false;
        }
    };
    SearchComponent.prototype.populateText = function (event) {
        this.searchText = event.target.value;
    };
    SearchComponent.prototype.emptyCheck = function (event) {
        if (this.searchText === '') {
            event.preventDefault();
            this.input.nativeElement.focus();
        }
    };
    SearchComponent.prototype.search = function (event) {
        this.searchSubmitted.emit(event);
        this.router.navigateByUrl('/list?search=' + event.target.elements[0].value);
    };
    return SearchComponent;
}());
__decorate([
    Output(),
    __metadata("design:type", Object)
], SearchComponent.prototype, "searchSubmitted", void 0);
__decorate([
    ViewChild('input'),
    __metadata("design:type", ElementRef)
], SearchComponent.prototype, "input", void 0);
SearchComponent = __decorate([
    Component({
        selector: 'app-search',
        templateUrl: './search.component.html'
    }),
    __metadata("design:paramtypes", [Router])
], SearchComponent);
export { SearchComponent };
//# sourceMappingURL=search.component.js.map