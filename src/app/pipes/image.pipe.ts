import { Pipe, PipeTransform } from '@angular/core'
import * as _ from 'lodash'

@Pipe({
  name: 'ImagePipe',
  pure: false

})
export class ImagePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return ''
  }
}
