var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
import * as _ from 'lodash';
var PaginationPipe = (function () {
    function PaginationPipe() {
    }
    PaginationPipe.prototype.transform = function (value, args) {
        var perPage = (_.isUndefined(args)) ? 100000 : (args.itemsPerPageCurrent === 'All') ? 100000 : args.itemsPerPageCurrent;
        var chunkedValue = _.chunk(value, perPage);
        return chunkedValue[args.currentPage];
    };
    return PaginationPipe;
}());
PaginationPipe = __decorate([
    Pipe({
        name: 'PaginationPipe',
        pure: false
    })
], PaginationPipe);
export { PaginationPipe };
//# sourceMappingURL=pagination.pipe.js.map