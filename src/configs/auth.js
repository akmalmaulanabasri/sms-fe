export default {
  meEndpoint: 'https://sms-demo-be.dygital.my.id/api/auth/me',
  loginEndpoint: 'https://sms-demo-be.dygital.my.id/api/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
