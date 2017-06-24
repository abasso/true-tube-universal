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
import { DataService } from './../../services/data.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
var PartnersCarouselComponent = (function () {
    function PartnersCarouselComponent(dataService, angulartics2GoogleAnalytics, angulartics2) {
        this.dataService = dataService;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.carouselConfig = {
            slidesPerGroup: 3,
            slidesPerView: 5,
            spaceBetween: 10,
            breakpoints: {
                400: {
                    slidesPerGroup: 1,
                    slidesPerView: 1,
                    spaceBetween: 0,
                    autoplay: 1500
                },
                767: {
                    slidesPerGroup: 1,
                    slidesPerView: 2,
                    spaceBetween: 20,
                    autoplay: 1500
                },
                992: {
                    slidesPerGroup: 1,
                    slidesPerView: 3,
                    spaceBetween: 10
                },
                1200: {
                    slidesPerGroup: 2,
                    slidesPerView: 4,
                    spaceBetween: 10
                }
            }
        };
    }
    PartnersCarouselComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data = this.dataService.itemPages('partners')
            .subscribe(function (data) {
            _this.slides = data._source.items;
        });
    };
    return PartnersCarouselComponent;
}());
PartnersCarouselComponent = __decorate([
    Component({
        selector: 'app-partners-carousel',
        templateUrl: './partners-carousel.component.html'
    }),
    __metadata("design:paramtypes", [DataService,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], PartnersCarouselComponent);
export { PartnersCarouselComponent };
//# sourceMappingURL=partners-carousel.component.js.map