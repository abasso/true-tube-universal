import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-topics-block',
  templateUrl: './topics.component.html'
})
export class TopicsComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  navigate(event: any, topic: any) {
    event.preventDefault()
    this.router.navigateByUrl('/list?topics=' + topic)
  }
}
