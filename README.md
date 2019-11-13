# React Native Keycloak Adapter

<a href="https://www.npmjs.com/package/react-native-keycloak-adapter"><img src="https://img.shields.io/npm/v/react-native-keycloak-adapter.svg"></a>

Adapter to authenticate in keycloak from react native.

## Platforms Supported

- [ ] iOS (Not tested)
- [x] Android

## Usage 


### Login component

```jsx
<KeycloakAdapter.Login 
    config={this.config} 
    onLogin={this._handleLogin}
    spinner={true}
    disableZoom
/>
```

#### Props
- **config**: keycloak configuration.

	```js
	{
	    url: 'https://<KEYCLOAK_HOST>/auth',
	    realm: '<REALM NAME>',
	    client_id: '<CLIENT ID>',
	    redirect_uri: '<REDIRECT URI>',
	}
	```

- **onLogin**: It is called once you have logged in.
- **spinner**: Spinner shown while loading the login or some url.
- **customSpinner**: Component of your own spinner.
- **disableZoom**: Disable zoom.

### Token storage

Token management.

##### Get tokens

```js
let tokens = await  KeycloakAdapter.tokenStorage.getTokens();
```

##### Set tokens

```js
await  KeycloakAdapter.tokenStorage.setTokens(tokens);
```

##### Delete tokens

```js
await  KeycloakAdapter.tokenStorage.deleteTokens();
```

### Decode token

Get user information through the stored token.

```js
let userInfo = await KeycloakAdapter.decodeToken();
```

### Update token

Update the token, you can pass a number of minutes as a parameter, to update the token only if it expires in less than the indicated time.

```js
let tokens = await KeycloakAdapter.updateToken();
```

### Logout

```js
await  KeycloakAdapter.logout();
```

### Example

```jsx
import React, { Component } from 'react';
import  KeycloakAdapter  from  'react-native-keycloak-adapter';

class Login extends Component {
  
    constructor(props) {
        super(props);
        // Here your way to get the necessary settings.
        this.config = {
            url: 'https://<KEYCLOAK_HOST>/auth',
            realm: '<REALM NAME>',
            client_id: '<CLIENT ID>',
            redirect_uri: '<REDIRECT URI>',
        }
    }
    
    _handleLogin(token, redirectUrl) {
        //You can decide how to handle the login either by navigating to a component, 
        //using Linking or any way you can think of.
        
        this.props.navigation.replace('Home');
    }  
  
    render() {
      return (
        <KeycloakAdapter.Login 
            config={this.config}
            onLogin={this._handleLogin}
            spinner={true}
            disableZoom
         />
      );
    }
    
    export default Login
}
```

## Contributing

- [ ] Implement IOS.

## License

MIT


