const { ApolloError } = require('apollo-server');

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

class InsufficientInformationError extends ApolloError
{
  constructor(message) {
    super(message, 'INSUFFICIENT_INFORMATION');
    this.name = 'ArgumentError';
  }
}

class AuthorizationError extends ApolloError
{
  constructor(message) {
    super(message, 'UNAUTHORIZED');
    this.name = 'AuthorizationError';
  }
}

class MailError extends ApolloError
{
  constructor(message) {
    super(message, 'UNABLE_TO_SEND_EMAIL');
    this.name = 'MailError';
  }
}

module.exports = { ArgumentError,
                   DbClientError,
                   DbError,
                   GraphQlError,
                   InsufficientInformationError,
                   AuthorizationError,
                   MailError }
