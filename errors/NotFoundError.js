class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFound';
    this.message = message;
    this.status = 404;
  }
}

module.exports = NotFoundError;
