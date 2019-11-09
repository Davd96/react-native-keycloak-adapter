import * as querystring from 'query-string';
import uuid from 'react-native-uuid';

export function getRealmURL(config) {
    const { url, realm } = config;
    const slash = url.endsWith('/') ? '' : '/';
    return `${url + slash}realms/${encodeURIComponent(realm)}`;
}

export function getLoginURL(config) {
    const { redirect_uri, client_id, kc_idp_hint } = config;
    const response_type = 'code';
    const state = uuid.v4();

    const url = getRealmURL(config) + '/protocol/openid-connect/auth?' + querystring.stringify({
        kc_idp_hint,
        redirect_uri,
        client_id,
        response_type,
        state,
    });

    return url;
}
