class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = "ConflictError";
  }
}

module.exports = ConflictError;
