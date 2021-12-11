


const { SongsLoadSchema} = require('./schema')

const InvariantError = require('../../exception/InvariantError');

const SongValidator = {

    validateSongPayload : (payload) => {
        const validationResult = SongsLoadSchema.validate(payload);
   
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }

}

module.exports = SongValidator