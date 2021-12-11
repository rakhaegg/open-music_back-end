


const { SongPlaylistLoadSchema} = require('./schema')

const InvariantError = require('../../exception/InvariantError');

const PlaylistSongValidator = {

    validatePlaylistSongPayload : (payload) => {
        const validationResult = SongPlaylistLoadSchema.validate(payload);
   
        if(validationResult.error){
            throw new InvariantError(validationResult.error.message)
        }
    }

}

module.exports = PlaylistSongValidator