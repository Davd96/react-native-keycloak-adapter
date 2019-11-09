import KeycloakAdapter from './src/keycloakAdapter';
import TokenStorage from './src/tokenStorage';
import KeycloakService from './src/keycloakService';

const tokenStorage = new TokenStorage('keycloak-token-storage');
const keycloakService = new KeycloakService(tokenStorage);
export default new KeycloakAdapter(tokenStorage, keycloakService);
