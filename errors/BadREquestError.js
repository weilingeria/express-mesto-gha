class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.message = message;
    this.status = 400;
  }
}

module.exports = BadRequestError;
