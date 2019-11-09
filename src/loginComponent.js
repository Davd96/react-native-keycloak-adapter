import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { View, ActivityIndicator } from 'react-native';
import styles from './styles';

import { disableZoomJavascript } from './util';
import * as urlManager from './url';


class LoginWebView extends Component {

    constructor(props) {
        super(props);
        this.keycloakService = this.props.keycloakService;
        this.keycloakService.setConfig = this.props.config;

        this.isLoading = false;

        this.state = {
            url: urlManager.getLoginURL(this.props.config),
            spinner: false,
        };

        this._handleRedirect = this._handleRedirect.bind(this);
        this._handleOpenURL = this._handleOpenURL.bind(this);
        this._onLoadStart = this._onLoadStart.bind(this);
        this._onLoadEnd = this._onLoadEnd.bind(this);
    }

    async _handleOpenURL(request) {
        const redirectUrl = request.url;

        if (redirectUrl.startsWith(this.props.config.redirect_uri)) {
            this.setState({ spinner: true });
            let tokens = await this.keycloakService.getToken(redirectUrl);
            this.setState({ spinner: false });
            this.props.onLogin(tokens);
        } else if (this.state.url !== redirectUrl) {
            this.setState({ url: redirectUrl });
        }
    }

    _handleRedirect(request) {
        this._handleOpenURL(request, this.props);
        return false;
    }

    _onLoadStart() {
        this.isLoading = true;
        this.setState({ spinner: true });
    }

    _onLoadEnd() {
        if (this.isLoading) {
            this.setState({ spinner: false }, () => {
                this.isLoading = false;
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <WebView
                    {...this.props}
                    originWhitelist={this.props.originWhitelist || ['*']}
                    onShouldStartLoadWithRequest={this._handleRedirect}
                    injectedJavaScript={!this.props.disableZoom ? null : disableZoomJavascript}
                    source={{ uri: this.state.url }}
                    onLoadStart={this._onLoadStart}
                    onLoadEnd={this._onLoadEnd}
                    scrollEnabled />


                {this.state.spinner && this.props.spinner && ((this.props.customSpinner) || (<ActivityIndicator style={styles.spinner} size="large" color="#0000ff" />))}
            </View>

        );
    }
}

export default LoginWebView;
