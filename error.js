
class ArgumentError extends Error {
  constructor(...args) {
    super(args);
    this.name = 'ArgumentError';
  }
}

class DbClientError extends Error {
  constructor(...args) {
    super(args);
    this.name = 'DbClientError';
  }
}

class DbError extends Error {
  constructor(...args) {
    super(args);
    this.name = 'DbError';
  }
}

class GraphQlError extends Error {
  constructor(...args) {
    super(args);
    this.name = 'GraphQlError';
  }
}

module.exports = { ArgumentError, DbClientError, DbError, GraphQlError }
