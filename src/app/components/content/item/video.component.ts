import { PLATFORM_ID, Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, OnDestroy, Inject} from '@angular/core'
import { AnalyticsService } from './../../../services/analytics.service'

import * as _ from 'lodash'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

declare var videojs: any

@Component({
  selector: 'app-video-player',
  templateUrl: './video.component.html'
})
export class VideoComponent implements OnInit, OnChanges, OnDestroy {
  @Output() playerEvent = new EventEmitter<string>()
  @Input() embed: any
  @Input() embeddedContent: any
  @Input() activeTab: any
  @Input() subtitles: any
  @Input() enableSubtitles: any
  @Input() play: any
  @ViewChild('player') player: ElementRef
  private videoJSplayer: any
  public playHeadTime = 0
  public hasBeenPlayed = false
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public analyticsService: AnalyticsService
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
        this.playerEvent.emit('watchedUnregistered')
        setTimeout(() => {
        if (!_.isUndefined(this.videoJSplayer)) {
          if (this.hasBeenPlayed === true) {
            this.analyticsService.emitEvent('Exit time ' + this.playHeadTime, 'Watch', this.embed.title)
          }
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
              v.addEventListener('play', (data) => {

                let watchCount = (localStorage.getItem('watchCount') === null) ? 0 : parseInt(localStorage.getItem('watchCount'))
                localStorage.setItem('watchCount', (watchCount + 1).toString())
                localStorage.setItem('watchedUnregistered', 'true')
                if(parseInt(localStorage.getItem('watchCount')) > 1) {
                  this.playerEvent.emit('watchedUnregistered')
                }
                this.hasBeenPlayed = true
                this.analyticsService.emitEvent('Play', 'Watch', self.embed.title)
              }, true)
              v.addEventListener('progress', function(data) {
                self.playHeadTime = self.videoJSplayer.currentTime()
              }, true)
          }, 1)
        }
      }
    }
  }
