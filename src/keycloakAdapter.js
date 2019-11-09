import React from 'react';

import { decodeToken } from './util';
import LoginWebView from './loginComponent';

class KeycloakAdapter {

    constructor(tokenStorage, keycloakService) {
        this.tokenStore = tokenStorage;
        this.keyService = keycloakService;

        this.Login = this.Login.bind(this);
        this.config = undefined;
    }

    get tokenStorage() {
        return this.tokenStore;
    }

    get keycloakService() {
        return this.keyService;
    }

    Login(props) {

        this.config = props.config;

        return (
            <LoginWebView
                {...props}
                config={props.config}
                onLogin={props.onLogin}
                tokenStorage={this.tokenStorage}
                keycloakService={this.keycloakService}
                spinner={props.spinner}
            />
        );
    }

    async decodeToken() {
        const tokens = JSON.parse(await this.tokenStorage.loadTokens());
        return decodeToken(tokens.access_token);
    }

    updateToken(minutes = undefined) {
        return new Promise(async (resolve, reject) => {
            let tokens,
                isUpdatable = true;

            if (minutes) {
                tokens = JSON.parse(await this.tokenStorage.getTokens()).expiration_date;

                let time = minutes * 60 * 1000;
                let actualDate = new Date().getTime();
                let expiration_date = tokens.expiration_date;

                isUpdatable = actualDate + time >= expiration_date;
            }

            if (isUpdatable) {
                try {
                    let updatedTokens = await this.keycloakService.updateToken();
                    resolve(updatedTokens);
                } catch (error) {
                    reject(error);
                }
            } else {
                resolve(tokens);
            }

        });
    }
}

export default KeycloakAdapter;
