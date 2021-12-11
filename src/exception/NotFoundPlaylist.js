
const ClientError = require('./ClientError');
     
class NotFoundPlaylistError extends ClientError {
  constructor(message) {
    super(message, 400);
    this.name = 'NotFoundError';
  }
}
module.exports = NotFoundPlaylistError;