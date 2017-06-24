import { Component, OnInit } from '@angular/core'
import { DataService } from './../../services/data.service'
import { Angulartics2 } from 'angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'

@Component({
  selector: 'app-partners-carousel',
  templateUrl: './partners-carousel.component.html'
})
export class PartnersCarouselComponent implements OnInit {
  public data: any
  public slides: any
  public carouselConfig = {
    slidesPerGroup: 3,
    slidesPerView: 5,
    spaceBetween: 10,
    breakpoints: {
      400: {
        slidesPerGroup: 1,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay: 1500
      },
      767: {
        slidesPerGroup: 1,
        slidesPerView: 2,
        spaceBetween: 20,
        autoplay: 1500
      },
      992: {
        slidesPerGroup: 1,
        slidesPerView: 3,
        spaceBetween: 10
      },
      1200: {
        slidesPerGroup: 2,
        slidesPerView: 4,
        spaceBetween: 10
      }
    }
  }
  constructor(
    private dataService: DataService,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2

  ) {

  }
  ngOnInit() {
    this.data = this.dataService.itemPages('partners')
    .subscribe(
      (data) => {
        this.slides = data._source.items
      }
    )
  }

}
