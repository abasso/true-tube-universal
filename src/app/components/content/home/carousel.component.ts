import { Component, OnInit } from '@angular/core'
import { DataService } from './../../../services/data.service'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import * as _ from 'lodash'

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html'
})
export class CarouselComponent implements OnInit {
  private data: any
  public slides: any
  public config = {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 0,
        loop: false,
        autoplay: 5000,
        speed: 600
      }
  constructor(
    private dataService: DataService,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2  ) {

  }
  ngOnInit() {
    this.data = this.dataService.carousel()
    .subscribe(
      (data) => {
        this.slides = data.hits.hits
        _.each(this.slides, (slide) => {
          if (slide._source.link.includes('http')) {
            slide.externalLink = true
          } else {
            slide.externalLink = false
          }
        })
      }
    )
  }
}
