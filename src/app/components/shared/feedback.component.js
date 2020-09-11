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
var FeedbackComponent = (function () {
    function FeedbackComponent(dataService) {
        this.dataService = dataService;
        this.showFeedback = false;
        this.feedback = {
            type: '',
            feedback: '',
        };
        this.feedbackTypes = [
            {
                value: 'general',
                label: 'General feedback'
            },
            {
                value: 'site',
                label: 'Feedback about the site'
            },
            {
                value: 'page',
                label: 'Feedback about this page'
            }
        ];
    }
    FeedbackComponent.prototype.ngOnInit = function () {
    };
    FeedbackComponent.prototype.toggleFeedback = function () {
        if (this.showFeedback === false) {
            this.showFeedback = true;
        }
        else {
            this.showFeedback = false;
        }
    };
    FeedbackComponent.prototype.submitFeedback = function (event) {
        // this.feedback.json = window
        if (this.feedback.email == '' || this.feedback.type == '') {
        } else {
          this.dataService.sendFeedback(this.feedback)
        }
    };
    return FeedbackComponent;
}());
FeedbackComponent = __decorate([
    Component({
        selector: 'app-feedback',
        templateUrl: './feedback.component.html'
    }),
    __metadata("design:paramtypes", [DataService])
], FeedbackComponent);
export { FeedbackComponent };
//# sourceMappingURL=feedback.component.js.map