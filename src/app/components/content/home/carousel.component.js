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
import { DataService } from './../../../services/data.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
import * as _ from 'lodash';
var CarouselComponent = (function () {
    function CarouselComponent(dataService, angulartics2GoogleAnalytics, angulartics2) {
        this.dataService = dataService;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.config = {
            pagination: '.swiper-pagination',
            slidesPerView: 1,
            paginationClickable: true,
            spaceBetween: 0,
            loop: false,
            autoplay: 5000,
            speed: 600
        };
    }
    CarouselComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data = this.dataService.carousel()
            .subscribe(function (data) {
            _this.slides = data.hits.hits;
            _.each(_this.slides, function (slide) {
                if (slide._source.link.includes('http')) {
                    slide.externalLink = true;
                }
                else {
                    slide.externalLink = false;
                }
            });
        });
    };
    return CarouselComponent;
}());
CarouselComponent = __decorate([
    Component({
        selector: 'app-carousel',
        templateUrl: './carousel.component.html'
    }),
    __metadata("design:paramtypes", [DataService,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], CarouselComponent);
export { CarouselComponent };
//# sourceMappingURL=carousel.component.js.map