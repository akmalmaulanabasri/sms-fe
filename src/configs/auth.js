export default {
  meEndpoint: 'http://localhost:8090/api/auth/me',
  loginEndpoint: 'http://localhost:8090/api/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
