import { Injectable } from '@angular/core'
import {AuthHttp} from 'angular2-jwt'

@Injectable()
export class UserService {

  constructor(
    private http: AuthHttp
  ) {}
  addToList(list: any, id: any) {
    this.http.post('https://www.truetube.co.uk/v5/api/me/' + list + '/' + id, {})
      .subscribe(
        (data) => {
          if (data['message'] = 'item added') {
            return true
          }
        }
      )
  }
  removeFromList(list: any, id: any) {
    this.http.delete('https://www.truetube.co.uk/v5/api/me/' + list + '/' + id)
      .subscribe(
        data => {
          if (data['message'] = 'item removed') {
            return true
          }
        }
      )
    }
    removeList(list: any) {
      this.http.delete('https://www.truetube.co.uk/v5/api/me/' + list)
        .subscribe(
          data => {
            if (data['message'] = 'item removed') {
              return true
            }
          }
        )
      }
}
