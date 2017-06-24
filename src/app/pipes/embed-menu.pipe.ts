import { Pipe, PipeTransform } from '@angular/core'
import { ContentTypes } from './../definitions/content-types'
import * as _ from 'lodash'

@Pipe({
  name: 'EmbedMenuPipe'
})
export class EmbedMenuPipe implements PipeTransform {

  transform(value: any, args?: any) {
    let embedMenu: any[] = []
    _.each(value, (embed, index) => {
      let type: any = _.find(ContentTypes, {term: embed.type})
      if (_.isUndefined(type)) {
        return
      }
      type.tabLabel = (embed.count === 1 && type.label !== 'Teachers Notes') ? _.trimEnd(type.label, 's') : type.label
      type.active = (parseInt(index) === 0) ? true : false
      embedMenu.push(type)
    })
    return (embedMenu.length > 1) ? embedMenu : null
  }

}
