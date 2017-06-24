import { Injectable } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import * as _ from 'lodash'

@Injectable()
export class ListService {

  private resetCurrentPathSource = new Subject()

  pathToReset$ = this.resetCurrentPathSource.asObservable()

  resetCurrentPath(query: any) {
    this.resetCurrentPathSource.next(query)
  }

  stringifyTitleArray(array: any[]) {
    array = _.filter(array, {active: true})
    array = _.map(array, 'label')
    let arrayString: string = array.join(', ')
    return arrayString.replace(/,([^,]*)$/, ' & $1')
  }

  pageTitle(subject: string, keystages: any[], types: any[], term: string, categories: string, topics: any[]) {
    let categoriesString: string = (_.isUndefined(categories) || categories === '') ? '' : categories
    let topicsString: string = (_.findIndex(types, { 'active': true}) === -1 || (_.findLastIndex(types, { 'active': true}) === types.length)) ? this.stringifyTitleArray(topics) : ''
    let subjectString: string = (subject === 'All') ? '' : subject
    let keystagesString: string = (_.findIndex(keystages, { 'active': true}) === -1) ? '' : 'Key Stage ' + this.stringifyTitleArray(keystages)
    let typesString: string = (_.findIndex(types, { 'active': true}) === -1) ? '' : this.stringifyTitleArray(types)
    let termString: string = (term === null || term === '') ? '' : term
    if (topicsString !== '') {
      categoriesString = ''
    }
    if (categoriesString === '' && topicsString === '' && subjectString === '' && keystagesString === '' && typesString === '' && termString === '') {
      return 'All Content'
    }
    return categoriesString + ' ' + topicsString + ' ' + subjectString + ' ' + keystagesString + ' ' + termString + ' ' + typesString
  }
}
