import { Component, OnInit } from '@angular/core'
import { DataService } from './../../services/data.service'
import { Angulartics2 } from 'angulartics2'


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
    }
  }

  constructor(
    private dataService: DataService,

    public angulartics2: Angulartics2
  ) {
    this.carouselConfig.breakpoints = {
      '400': {
        slidesPerGroup: 1,
        slidesPerView: 1,
        spaceBetween: 0,
        autoplay: 1500
      },
      '767': {
        slidesPerGroup: 1,
        slidesPerView: 2,
        spaceBetween: 20,
        autoplay: 1500
      },
      '992': {
        slidesPerGroup: 1,
        slidesPerView: 3,
        spaceBetween: 10
      },
      '1200': {
        slidesPerGroup: 2,
        slidesPerView: 4,
        spaceBetween: 10
      }

    }

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
