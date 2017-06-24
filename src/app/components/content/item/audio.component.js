var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
var AudioComponent = (function () {
    function AudioComponent() {
        this.hideAdvisory = false;
    }
    AudioComponent.prototype.ngOnInit = function () {
        this.resetPlayer();
    };
    AudioComponent.prototype.ngOnDestroy = function () {
        // setTimeout(() => {
        this.videoJSplayer.dispose();
        // }, 1)
    };
    AudioComponent.prototype.playPlayer = function (event) {
        event.preventDefault();
        this.videoJSplayer.play();
        this.hideAdvisory = true;
    };
    AudioComponent.prototype.resetPlayer = function () {
        var _this = this;
        // setTimeout(
        (function () {
            _this.videoJSplayer = videojs(_this.player.nativeElement.id, { 'html5': {
                    nativeTextTracks: false
                } });
            if (_this.activeTab === 'audio') {
                var poster = document.querySelectorAll('.vjs-poster');
                poster[0].setAttribute('style', 'background-image: url("' + _this.embeddedContent.audio[0].thumbnail + '")');
            }
            // }, 1)
        });
    };
    return AudioComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], AudioComponent.prototype, "embed", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AudioComponent.prototype, "embeddedContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AudioComponent.prototype, "activeTab", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], AudioComponent.prototype, "subtitles", void 0);
__decorate([
    ViewChild('player'),
    __metadata("design:type", ElementRef)
], AudioComponent.prototype, "player", void 0);
AudioComponent = __decorate([
    Component({
        selector: 'app-audio-player',
        templateUrl: './audio.component.html'
    }),
    __metadata("design:paramtypes", [])
], AudioComponent);
export { AudioComponent };
//# sourceMappingURL=audio.component.js.map