var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { PLATFORM_ID, Component, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga';
import * as _ from 'lodash';
import { isPlatformBrowser } from '@angular/common';
var VideoComponent = (function () {
    function VideoComponent(platformId, angulartics2GoogleAnalytics, angulartics2) {
        this.platformId = platformId;
        this.angulartics2GoogleAnalytics = angulartics2GoogleAnalytics;
        this.angulartics2 = angulartics2;
        this.playHeadTime = 0;
    }
    VideoComponent.prototype.ngOnInit = function () {
        this.resetPlayer();
    };
    VideoComponent.prototype.ngOnChanges = function () {
        if (this.play === true && !_.isUndefined(this.videoJSplayer)) {
            this.playPlayer(null);
            if (this.enableSubtitles === true) {
                var tracks = this.videoJSplayer.textTracks();
                for (var i = 0; i < tracks.length; i++) {
                    var track = tracks[i];
                    if (track.kind === 'captions' && track.language === 'en') {
                        track.mode = 'showing';
                    }
                }
            }
        }
    };
    VideoComponent.prototype.ngOnDestroy = function () {
        var _this = this;
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(function () {
                if (!_.isUndefined(_this.videoJSplayer)) {
                    _this.angulartics2.eventTrack.next({ action: 'Watch', properties: { category: 'Exit time ' + _this.playHeadTime, title: _this.embed.title } });
                    _this.videoJSplayer.dispose();
                }
            }, 1);
        }
    };
    VideoComponent.prototype.playPlayer = function (event) {
        if (event !== null) {
            event.preventDefault();
        }
        this.videoJSplayer.play();
    };
    VideoComponent.prototype.resetPlayer = function () {
        var _this = this;
        if (isPlatformBrowser(this.platformId)) {
            if (this.activeTab === 'film') {
                setTimeout(function () {
                    var self = _this;
                    _this.videoJSplayer = videojs(_this.player.nativeElement.id, { 'html5': {
                            nativeTextTracks: false
                        } });
                    var v = document.getElementsByTagName('video')[0];
                    v.addEventListener('play', function (data) {
                        self.angulartics2.eventTrack.next({ action: 'Watch', properties: { category: 'Play', title: self.embed.title } });
                    }, true);
                    v.addEventListener('progress', function (data) {
                        self.playHeadTime = self.videoJSplayer.currentTime();
                    }, true);
                }, 1);
            }
        }
    };
    return VideoComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Object)
], VideoComponent.prototype, "embed", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], VideoComponent.prototype, "embeddedContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], VideoComponent.prototype, "activeTab", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], VideoComponent.prototype, "subtitles", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], VideoComponent.prototype, "enableSubtitles", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], VideoComponent.prototype, "play", void 0);
__decorate([
    ViewChild('player'),
    __metadata("design:type", ElementRef)
], VideoComponent.prototype, "player", void 0);
VideoComponent = __decorate([
    Component({
        selector: 'app-video-player',
        templateUrl: './video.component.html'
    }),
    __param(0, Inject(PLATFORM_ID)),
    __metadata("design:paramtypes", [Object,
        Angulartics2GoogleAnalytics,
        Angulartics2])
], VideoComponent);
export { VideoComponent };
//# sourceMappingURL=video.component.js.map