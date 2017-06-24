var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pipe } from '@angular/core';
import { ContentTypes } from './../definitions/content-types';
import * as _ from 'lodash';
var EmbedMenuPipe = (function () {
    function EmbedMenuPipe() {
    }
    EmbedMenuPipe.prototype.transform = function (value, args) {
        var embedMenu = [];
        _.each(value, function (embed, index) {
            var type = _.find(ContentTypes, { term: embed.type });
            if (_.isUndefined(type)) {
                return;
            }
            type.tabLabel = (embed.count === 1 && type.label !== 'Teachers Notes') ? _.trimEnd(type.label, 's') : type.label;
            type.active = (parseInt(index) === 0) ? true : false;
            embedMenu.push(type);
        });
        return (embedMenu.length > 1) ? embedMenu : null;
    };
    return EmbedMenuPipe;
}());
EmbedMenuPipe = __decorate([
    Pipe({
        name: 'EmbedMenuPipe'
    })
], EmbedMenuPipe);
export { EmbedMenuPipe };
//# sourceMappingURL=embed-menu.pipe.js.map