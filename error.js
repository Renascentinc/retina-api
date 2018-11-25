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

function formatPgError(error) {
  if (typeof error.extensions.exception.constraint === 'string') {
    error.extensions.code = `${error.extensions.exception.constraint.toUpperCase()}_CONSTRAINT_VIOLATION`;
    error.extensions.name = 'DbConstraintViolationError';
  } else {
    error.extensions.code = 'UNKNOWN_DB_ERROR';
    error.extensions.name = 'UnknownDbError';
  }

  delete error.extensions.exception;
  return error;
}

function apolloErrorFormatter(error) {
    if (error.extensions.exception.name === "PgError") {
      return formatPgError(error);
    }

    return error;
}

module.exports = { ArgumentError,
                   DbClientError,
                   GraphQlError,
                   InsufficientInformationError,
                   AuthorizationError,
                   MailError,
                   apolloErrorFormatter }
