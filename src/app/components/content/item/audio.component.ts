import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy} from '@angular/core'
import * as _ from 'lodash'
declare var videojs: any

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio.component.html'
})
export class AudioComponent implements OnInit, OnDestroy {
  @Input() embed: any
  @Input() embeddedContent: any
  @Input() activeTab: any
  @Input() subtitles: any
  @ViewChild('player') player: ElementRef
  private videoJSplayer: any
  private hideAdvisory = false

  constructor() { }

  ngOnInit() {
    this.resetPlayer()
  }
  ngOnDestroy() {
    // setTimeout(() => {
      this.videoJSplayer.dispose()
    // }, 1)
  }

  playPlayer(event: any) {
    event.preventDefault()
    this.videoJSplayer.play()
    this.hideAdvisory = true
  }

  resetPlayer() {
    // setTimeout(
      () => {
        this.videoJSplayer = videojs(this.player.nativeElement.id, {'html5': {
          nativeTextTracks: false
        }})
        if (this.activeTab === 'audio') {
          let poster = document.querySelectorAll('.vjs-poster')
          poster[0].setAttribute('style', 'background-image: url("' + this.embeddedContent.audio[0].thumbnail + '")')
        }
      // }, 1)
    }
  }
}
