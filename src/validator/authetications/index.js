/*
    Berbeda dengan pembuatan schema lain, pada schema authentications kita akan membuat 
    lebih dari satu schema. Karena memang kebutuhan payload tiap routes bisa berbeda. 
    Kita akan membuat schema untuk PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema, dan DeleteAuthenticationPayloadSchema.
*/

const {
    PostAuthenticationPayloadSchema,
    PutAuthenticationPayloadSchema,
    DeleteAuthenticationPayloadSchema,
  } = require('./schema');
  const InvariantError = require('../../exception/InvariantError');
   
  const AuthenticationsValidator = {
    validatePostAuthenticationPayload: (payload) => {
      const validationResult = PostAuthenticationPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
    validatePutAuthenticationPayload: (payload) => {
      const validationResult = PutAuthenticationPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
    validateDeleteAuthenticationPayload: (payload) => {
      const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);
      if (validationResult.error) {
        throw new InvariantError(validationResult.error.message);
      }
    },
  };
   
  module.exports = AuthenticationsValidator;