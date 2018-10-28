const { UserInputError, AuthenticationError } = require('apollo-server');
const { PasswordResetMailer } = require('mailer');
const { InsufficientInformationError } = require(`error`);

module.exports = {
  Mutation: {
    /**
     * First, look up the user based on their credentials, with or without using
     * organization name, depending on whether or not they included the organization_name
     * parameter. If a single user is returned, create a login response. Else, throw an authentication error
     *
     * @throws AuthenticationError if the user gave incorrect credentials
     */
    login: async (_, loginInfo, { db }) => {
      let userArray = loginInfo.organization_name ?
        await getUserByCredentialsAndOrganization(loginInfo, db) :
        await getUserByCredentials(loginInfo, db);

      if (userArray.length === 1) {
        return createLoginResponse(userArray[0], db);
      }

      throw new AuthenticationError(`Authentication failed`);
    },

    logout: async (_, __, { db, session }) => {
      let deletedToken = await db.delete_session({ token: session.token });
      return deletedToken[0] ? true : false;
    },

    requestPasswordReset: async (_, passwordResetRequestInfo, { db }) => {
      let userArray = passwordResetRequestInfo.organization_name ?
        await getUserByEmailAndOrganization(passwordResetRequestInfo, db) :
        await getUserByEmail(passwordResetRequestInfo, db);

      if (userArray.length === 0) {
        throw new UserInputError(`Email does not exist`);
      }

      let user = userArray[0];

      let passwordResetCredentials = await db.create_password_reset_credentials({
        user_id: user.id,
        organization_id: user.organization_id
      });

      passwordResetCredentials = passwordResetCredentials[0];


      let sentEmailResult = await new PasswordResetMailer().sendEmail({
        to: user.email,
        subject: 'Response to Password Reset Request',
        html: `https://retina-develop-us-east-2.s3-website.us-east-2.amazonaws.com/password-reset?code=${passwordResetCredentials.code}`
      });

      return sentEmailResult ? true : false;
    },

    resetPassword: async (_, { new_password, password_reset_code }, { db }) => {
      let passwordResetCredentials = await db.get_password_reset_credentials_by_code({ password_reset_code });

      if (passwordResetCredentials.length === 0) {
        throw new AuthenticationError('Password reset token is invalid');
      }

      passwordResetCredentials = passwordResetCredentials[0];

      let updatedUser = db.update_user_password_by_id({
        new_password,
        organization_id: passwordResetCredentials.organization_id,
        user_id: passwordResetCredentials.user_id
      });

      if (updatedUser.length === 0) {
        return false;
      }

      db.delete_password_reset_credentials_by_id({
        organization_id: passwordResetCredentials.organization_id,
        user_id: passwordResetCredentials.user_id
      })

      return true;
    }
  }
};

/**
 * Returns an array of users with the given email
 *
 * @throws InsufficientInformationError if email is not unique
 */
async function getUserByEmail({ email }, db) {
  let userArray = await db.get_user_by_email({
    email
  });

  if (userArray.length > 1) {
    throw new InsufficientInformationError(`Organization name required`);
  }

  return userArray;
}

/**
 * Returns an array of users with the given email and organization name
 *
 * @throws UserInputError if org does not exist
 */
async function getUserByEmailAndOrganization({ email, organization_name }, db) {
  let organization = await db.get_organization_by_name({
    organization_name
  });

  if (organization.length === 0) {
    throw new UserInputError(`Organization "${organization_name}" does not exist`);
  }

  organization = organization[0];

  return await db.get_user_by_email_and_organization({
    organization_id: organization.id,
    email,
  });
}

/**
 * Returns an array of users with the given credentials
 *
 * @throws InsufficientInformationError if email is not unique
 */
async function getUserByCredentials({ email, password }, db) {
  let userArray = await db.get_user_by_email({
    email
  });

  if (userArray.length > 1) {
    throw new InsufficientInformationError(`Organization name required`);
  }

  return await db.get_user_by_credentials({
    email,
    password
  });
}

/**
 * Returns an array of users with the given credentials and organization name
 *
 * @throws UserInputError if org does not exist
 */
async function getUserByCredentialsAndOrganization({ email, password, organization_name }, db) {
  let organization = await db.get_organization_by_name({
    organization_name
  });

  if (organization.length === 0) {
    throw new UserInputError(`Organization "${organization_name}" does not exist`);
  }

  organization = organization[0];

  return await db.get_user_by_credentials_and_organization({
    organization_id: organization.id,
    email,
    password
  });
}

/**
 * First check to see if the given user is already logged in and if so, send
 * back their token and information. Else, create a new session and send back the
 * token and user information
 *
 * @throws ApolloError[SESSION_CREATION_ERROR] if the session fails to be created
 */
async function createLoginResponse(user, db) {
  let existingSession = await db.get_session_by_user_id({
    user_id: user.id
  });

  if (existingSession.length === 1) {
    return {
      token: existingSession[0].token,
      user
    }
  }

  let newSession = await db.create_session({
    organization_id: user.organization_id,
    user_id: user.id
  });

  if (newSession.length === 0) {
    throw new ApolloError(`Failed to create user session`, 'SESSION_CREATION_ERROR');
  }

  return {
    token: newSession[0].token,
    user
  }
}
