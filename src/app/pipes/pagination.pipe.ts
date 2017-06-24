import { Pipe, PipeTransform } from '@angular/core'
import * as _ from 'lodash'

@Pipe({
  name: 'PaginationPipe',
  pure: false

})
export class PaginationPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let perPage: any = (_.isUndefined(args)) ? 100000 : (args.itemsPerPageCurrent === 'All') ? 100000 : args.itemsPerPageCurrent
    let chunkedValue: any = _.chunk(value, perPage)
    return chunkedValue[args.currentPage]
  }
}
