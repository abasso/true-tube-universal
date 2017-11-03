import { Pipe, PipeTransform } from '@angular/core'
import * as _ from 'lodash'

@Pipe({
  name: 'AttributePipe'
})
export class AttributePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let attributes: any[] = []
    _.each(value, (attribute, index) => {
      attribute = attribute.replace('&', 'and')
      let attributeObject = {
        label: (parseInt(index) !== value.length - 1) ? attribute + ',&nbsp;' : attribute,
        slug: _.toLower(attribute)
      }
      attributes.push(attributeObject)
    })
    return attributes

  }

}
