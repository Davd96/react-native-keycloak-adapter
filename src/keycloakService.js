import * as querystring from 'query-string';
import * as urlManager from './url';
import axios from 'axios';

class KeycloakService {

    constructor(tokenStorage) {
        this.tokenStorage = tokenStorage;

    }

    set setConfig(config) {
        this.config = config;
    }

    _getCodeFromUrl(url) {
        const { code } = querystring.parse(querystring.extract(url));
        return code;
    }

    getToken(redirectUrl) {
        return new Promise(async (resolve, reject) => {
            const { redirect_uri, client_id } = this.config;
            const url = `${urlManager.getRealmURL(this.config)}/protocol/openid-connect/token`;
            const code = this._getCodeFromUrl(redirectUrl);

            const data = querystring.stringify({
                grant_type: 'authorization_code', redirect_uri: redirect_uri, client_id: client_id, code,
            })

            const fullResponse = await axios({
                method: 'post',
                url: url,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data,
            })

            if (fullResponse.status.toString()[0] === '2') {
                await this.tokenStorage.setTokens(fullResponse.data);
                resolve(fullResponse.data);
            } else {
                reject(fullResponse);
            }
        });
    }

    updateToken() {
        return new Promise(async (resolve, reject) => {

            const token = JSON.parse(await this.tokenStorage.getTokens()).refresh_token;
            const { client_id } = this.config;
            const url = `${urlManager.getRealmURL(this.config)}/protocol/openid-connect/token`;

            const fullResponse = await axios({
                method: 'post',
                url: url,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: querystring.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: token,
                    client_id: encodeURIComponent(client_id),
                }),
            })

            if (fullResponse.status.toString()[0] === '2') {
                await this.tokenStorage.setTokens(fullResponse.data);
                resolve(fullResponse.data);
            } else {
                reject(fullResponse);
            }
        });
    }


    logout() {

        return new Promise(async (resolve, reject) => {

            const token = JSON.parse(await this.tokenStorage.getTokens()).refresh_token;
            const { client_id } = this.config;
            const url = `${urlManager.getRealmURL(this.config)}/protocol/openid-connect/logout`;

            const fullResponse = await axios({
                method: 'post',
                url: url,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: querystring.stringify({
                    refresh_token: token,
                    client_id: client_id,
                })
            })


            if (fullResponse.status.toString()[0] === '2') {
                resolve();
            } else {
                reject();
            }

        });
    }
}

export default KeycloakService;
