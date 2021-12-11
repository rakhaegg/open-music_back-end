
const { PlaylistLoadSchema} = require('./schema')

const InvariantError = require('../../exception/InvariantError');

const PlaylistValidator = {

    validatePlaylistLoad : (payload) => {
        const validationResult = PlaylistLoadSchema.validate(payload);
   
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }

}

module.exports = PlaylistValidator