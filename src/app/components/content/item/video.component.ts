import { PLATFORM_ID, Component, OnInit, Input, ViewChild, ElementRef, OnChanges, OnDestroy, Inject} from '@angular/core'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import * as _ from 'lodash'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

declare var videojs: any

@Component({
  selector: 'app-video-player',
  templateUrl: './video.component.html'
})
export class VideoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() embed: any
  @Input() embeddedContent: any
  @Input() activeTab: any
  @Input() subtitles: any
  @Input() enableSubtitles: any
  @Input() play: any
  @ViewChild('player') player: ElementRef
  private videoJSplayer: any
  public playHeadTime = 0
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2
  ) { }

  ngOnInit() {
    this.resetPlayer()
  }

  ngOnChanges() {
    if (this.play === true && !_.isUndefined(this.videoJSplayer)) {
      this.playPlayer(null)
      if (this.enableSubtitles === true) {
        let tracks = this.videoJSplayer.textTracks()
        for (let i = 0; i < tracks.length; i++) {
          let track = tracks[i]
          if (track.kind === 'captions' && track.language === 'en') {
            track.mode = 'showing'
          }
        }
      }

    }
  }

  ngOnDestroy() {
      if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (!_.isUndefined(this.videoJSplayer)) {
          this.angulartics2.eventTrack.next({ action: 'Watch', properties: { category: 'Exit time ' + this.playHeadTime, title: this.embed.title}})
          this.videoJSplayer.dispose()
        }
      }, 1)
    }
  }

  playPlayer(event: any) {
    if (event !== null) {
      event.preventDefault()
    }
    this.videoJSplayer.play()
  }

  resetPlayer() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.activeTab === 'film') {
        setTimeout(
          () => {
            let self = this
            this.videoJSplayer = videojs(this.player.nativeElement.id, {'html5': {
              nativeTextTracks: false
            }})
              let v = document.getElementsByTagName('video')[0]
              v.addEventListener('play', function(data) {
                self.angulartics2.eventTrack.next({ action: 'Watch', properties: { category: 'Play', title: self.embed.title}})
              }, true)
              v.addEventListener('progress', function(data) {
                self.playHeadTime = self.videoJSplayer.currentTime()
              }, true)
          }, 1)
        }
      }
    }
  }
