import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { DataService } from './../../../services/data.service'
import { PaginationPipe } from './../../../pipes/pagination.pipe'
import { ImagePipe } from './../../../pipes/image.pipe'
import { ListFilterComponent } from './filter.component'
import { ActivatedRoute } from '@angular/router'
import { AnalyticsService } from './../../../services/analytics.service'

import * as _ from 'lodash'

@Component({
  selector: 'app-list-item-related',
  templateUrl: './list-item-related.component.html',
  providers: [
    PaginationPipe,
    ImagePipe
  ]
})
export class ListItemRelatedComponent implements OnInit, OnChanges {
  @Input() items: any
  @Input() paginationData: any
  public currentType: any
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    public analyticsService: AnalyticsService,
    public listFilterComponent: ListFilterComponent,
  ) { }

  ngOnInit() {
    this.fixSource()
    this.route.queryParams
    .map(params => params['content types'])
    .subscribe((types) => {
      if (!_.isUndefined(types)) {
          let typeArray: any[] = types.split(',')
          _.each(typeArray, (type) => {
            if (typeArray.length === 1) {
              this.currentType = {
                'tab': _.trim(type, 's')
              }
            } else {
              this.currentType = {}
            }
          })
      }
    })
  }

  ngOnChanges() {
    this.fixSource()
  }

  fixSource() {
    _.each(this.items, (item) => {
      if (_.isUndefined(item._source)) {
        item._source = item
      }
    })
  }

}