import { Pipe, PipeTransform } from '@angular/core'
import * as _ from 'lodash'

@Pipe({
  name: 'QueryStringPipe'
})
export class QueryStringPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    _.each(value, (item) => {
      let query: any = {}
      query[args] = item.slug
      item.query = query
    })

    return value
  }

}
