export default {
  meEndpoint: 'http://88.222.242.97:8090/api/auth/me',
  loginEndpoint: 'http://88.222.242.97:8090/api/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
