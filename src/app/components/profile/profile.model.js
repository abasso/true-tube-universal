import * as _ from 'lodash';
var Profile = (function () {
    function Profile() {
    }
    Profile.hydrate = function (data) {
        var instance = new Profile();
        instance.uuid = _.get(data, 'uuid', '');
        instance.name = _.get(data, 'name', '');
        instance.email = _.get(data, 'email', '');
        instance.picture = _.get(data, 'picture', '');
        instance.created = _.get(data, 'created_at', '');
        instance.lastLogin = _.get(data, 'last_login', '');
        instance.lists = _.get(data, 'lists', '');
        return instance;
    };
    return Profile;
}());
export { Profile };
//# sourceMappingURL=profile.model.js.map