var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { DataService } from './../../../services/data.service';
import { PaginationPipe } from './../../../pipes/pagination.pipe';
import { ImagePipe } from './../../../pipes/image.pipe';
import { ListFilterComponent } from './filter.component';
import { ActivatedRoute } from '@angular/router';
import { Angulartics2 } from 'angulartics2/dist/core/angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
import * as _ from 'lodash';
var ListItemComponent = (function () {
    function ListItemComponent(route, dataService, angulartics2GoogleAnalytics, angulartics2, listFilterComponent) {
        this.route = route;
        this.dataService = dataService;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.listFilterComponent = listFilterComponent;
    }
    ListItemComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.fixSource();
        this.route.queryParams
            .map(function (params) { return params['content types']; })
            .subscribe(function (types) {
            if (!_.isUndefined(types)) {
                var typeArray_1 = types.split(',');
                _.each(typeArray_1, function (type) {
                    if (typeArray_1.length === 1) {
                        _this.currentType = {
                            'tab': _.trim(type, 's')
                        };
                    }
                    else {
                        _this.currentType = {};
                    }
                });
            }
        });
    };
    ListItemComponent.prototype.ngOnChanges = function () {
        this.fixSource();
    };
    ListItemComponent.prototype.fixSource = function () {
        _.each(this.items, function (item) {
            if (_.isUndefined(item._source)) {
                item._source = item;
            }
        });
    };
    return ListItemComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListItemComponent.prototype, "items", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListItemComponent.prototype, "paginationData", void 0);
ListItemComponent = __decorate([
    Component({
        selector: 'app-list-item',
        templateUrl: './list-item.component.html',
        providers: [
            PaginationPipe,
            ImagePipe
        ]
    }),
    __metadata("design:paramtypes", [ActivatedRoute,
        DataService,
        Angulartics2GoogleAnalytics,
        Angulartics2,
        ListFilterComponent])
], ListItemComponent);
export { ListItemComponent };
//# sourceMappingURL=list-item.component.js.map