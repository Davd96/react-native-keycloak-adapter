import AsyncStorage from '@react-native-async-storage/async-storage';

class TokenStorage {
    constructor(key) {
        this.key = key;
    }

    setTokens(tokens) {
        try {

            if (tokens.expires_in && tokens.refresh_expires_in) {
                let timestamp = new Date().getTime();
                tokens.expiration_date = timestamp + (tokens.expires_in * 1000);
                tokens.refresh_expiration_date = timestamp + (tokens.refresh_expires_in * 1000);
            }

            return AsyncStorage.setItem(this.key, JSON.stringify(tokens));
        } catch (error) {
            console.error(error);
        }
    }

    getTokens() {

        try {
            return AsyncStorage.getItem(this.key);
        } catch (error) {
            console.error(error);
        }

    }

    async deleteTokens() {

        try {
            return AsyncStorage.removeItem(this.key);
        } catch (error) {
            console.error(error);
        }

    }
}

export default TokenStorage;
