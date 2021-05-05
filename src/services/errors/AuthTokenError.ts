export class AuthTokenError extends Error {
  constructor() {
    super('Error wuth authentication token.');
  }
}
