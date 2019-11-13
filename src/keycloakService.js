import * as querystring from 'query-string';
import * as urlManager from './url';

import RNFetchBlob from 'rn-fetch-blob';




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

            const requestOptions = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: querystring.stringify({
                    grant_type: 'authorization_code', redirect_uri: redirect_uri, client_id: client_id, code,
                }),
            };

            const fullResponse = await RNFetchBlob.config({
                trusty: true,
            }).fetch('POST', url, requestOptions.headers, requestOptions.body);
            const jsonResponse = await fullResponse.json();
            if (fullResponse.respInfo.status.toString()[0] === '2') {
                await this.tokenStorage.setTokens(jsonResponse);
                resolve(jsonResponse);
            } else {
                reject(jsonResponse);
            }
        });
    }

    updateToken() {
        return new Promise(async (resolve, reject) => {

            const token = JSON.parse(await this.tokenStorage.getTokens()).refresh_token;
            const { client_id } = this.config;
            const url = `${urlManager.getRealmURL(this.config)}/protocol/openid-connect/token`;

            const requestOptions = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: querystring.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: token,
                    client_id: encodeURIComponent(client_id),
                }),
            };

            const fullResponse = await RNFetchBlob.config({
                trusty: true,
            }).fetch('POST', url, requestOptions.headers, requestOptions.body);

            const jsonResponse = await fullResponse.json();

            if (fullResponse.respInfo.status.toString()[0] === '2') {
                await this.tokenStorage.setTokens(jsonResponse);
                resolve(jsonResponse);
            } else {
                reject(jsonResponse);
            }
        });
    }


    logout() {

        return new Promise(async (resolve, reject) => {

            const token = JSON.parse(await this.tokenStorage.getTokens()).refresh_token;
            const { client_id } = this.config;
            const url = `${urlManager.getRealmURL(this.config)}/protocol/openid-connect/logout`;

            const requestOptions = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: querystring.stringify({
                    refresh_token: token,
                    client_id: client_id,
                }),
            };

            const fullResponse = await RNFetchBlob.config({
                trusty: true,
            }).fetch('POST', url, requestOptions.headers, requestOptions.body);

            if (fullResponse.respInfo.status.toString()[0] === '2') {
                resolve();
            } else {
                reject();
            }

        });
    }
}

export default KeycloakService;

