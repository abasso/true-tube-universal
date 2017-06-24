import * as _ from 'lodash'

export class Profile {
    public uuid: string
    public name: string
    public email: string
    public picture: string
    public created: string
    public lastLogin: string
    public lists: string

    public static hydrate(data: any): Profile {
        const instance = new Profile()
        instance.uuid = _.get(data, 'uuid', '')
        instance.name = _.get(data, 'name', '')
        instance.email = _.get(data, 'email', '')
        instance.picture = _.get(data, 'picture', '')
        instance.created = _.get(data, 'created_at', '')
        instance.lastLogin = _.get(data, 'last_login', '')
        instance.lists = _.get(data, 'lists', '')
        return instance
    }
}
