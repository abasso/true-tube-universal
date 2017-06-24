import { Component, OnInit } from '@angular/core'
import { DataService } from './../../services/data.service'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit {
  public showFeedback = false
  public textarea: string
  public feedback: any = {
    type: '',
    feedback: '',
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
  ) {
  }

  ngOnInit() {
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
  }

}
