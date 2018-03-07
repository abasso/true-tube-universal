import { PLATFORM_ID, Component, OnInit, Inject } from '@angular/core'
import { DataService } from './../../services/data.service'
import { isPlatformBrowser, isPlatformServer } from '@angular/common'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit {
  public showFeedback = false
  public textarea: string
  public thanks = false
  public feedback: any = {
    type: '',
    feedback: '',
    email: '',
    // json: {}
  }

  public feedbackTypes: any = [
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
  ]

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      let profile = JSON.parse(localStorage.getItem('profile'))
      if(typeof profile !== 'undefined' && profile !== null) {
        this.feedback.userId = profile.user_id
      }
      this.feedback.location = location.href
      this.feedback.cookies = this.checkCookie()
    }
  }

  ngOnInit() {
  }

  private checkCookie(): string {
    var cookieEnabled = navigator.cookieEnabled;
    if (!cookieEnabled) {
        document.cookie = "testcookie";
        cookieEnabled = document.cookie.indexOf("testcookie")!=-1;
    }
    return cookieEnabled ? 'true' : 'false'
  }

  public toggleFeedback(): void {
    if (this.showFeedback === false) {
      this.showFeedback = true
    } else {
      this.showFeedback = false
    }
  }

  public submitFeedback(event: any): void {
    // this.feedback.json = window
    this.dataService.sendFeedback(this.feedback)
    this.thanks = true
  }

  public hideFeedback(event: any): void {
    // this.feedback.json = window
    this.showFeedback = false
    this.thanks = false
    this.feedback.type = ''
    this.feedback.email = ''
    this.feedback.feedback = ''
  }
}