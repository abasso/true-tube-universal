import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { DataService } from './../../../services/data.service'
import { PaginationPipe } from './../../../pipes/pagination.pipe'
import { ImagePipe } from './../../../pipes/image.pipe'
import { ListFilterComponent } from './filter.component'
import { ActivatedRoute } from '@angular/router'
import { Angulartics2 } from 'angulartics2/dist/core/angulartics2'
import { Angulartics2GoogleAnalytics } from 'angulartics2/dist/providers/ga/angulartics2-ga'
import * as _ from 'lodash'

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  providers: [
    PaginationPipe,
    ImagePipe
  ]
})
export class ListItemComponent implements OnInit, OnChanges {
  @Input() items: any
  @Input() paginationData: any
  public currentType: any
  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    public angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private angulartics2: Angulartics2,
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
