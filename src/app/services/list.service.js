var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';
var ListService = (function () {
    function ListService() {
        this.resetCurrentPathSource = new Subject();
        this.pathToReset$ = this.resetCurrentPathSource.asObservable();
    }
    ListService.prototype.resetCurrentPath = function (query) {
        this.resetCurrentPathSource.next(query);
    };
    ListService.prototype.stringifyTitleArray = function (array) {
        array = _.filter(array, { active: true });
        array = _.map(array, 'label');
        var arrayString = array.join(', ');
        return arrayString.replace(/,([^,]*)$/, ' & $1');
    };
    ListService.prototype.pageTitle = function (subject, keystages, types, term, categories, topics) {
        var categoriesString = (_.isUndefined(categories) || categories === '') ? '' : categories;
        var topicsString = (_.findIndex(types, { 'active': true }) === -1 || (_.findLastIndex(types, { 'active': true }) === types.length)) ? this.stringifyTitleArray(topics) : '';
        var subjectString = (subject === 'All') ? '' : subject;
        var keystagesString = (_.findIndex(keystages, { 'active': true }) === -1) ? '' : 'Key Stage ' + this.stringifyTitleArray(keystages);
        var typesString = (_.findIndex(types, { 'active': true }) === -1) ? '' : this.stringifyTitleArray(types);
        var termString = (term === null || term === '') ? '' : term;
        if (topicsString !== '') {
            categoriesString = '';
        }
        if (categoriesString === '' && topicsString === '' && subjectString === '' && keystagesString === '' && typesString === '' && termString === '') {
            return 'All Content';
        }
        return categoriesString + ' ' + topicsString + ' ' + subjectString + ' ' + keystagesString + ' ' + termString + ' ' + typesString;
    };
    return ListService;
}());
ListService = __decorate([
    Injectable()
], ListService);
export { ListService };
//# sourceMappingURL=list.service.js.map