

const Joi = require('joi')

const SongPlaylistLoadSchema = Joi.object(

    {
        songId: Joi.string().required(),
       
    }

)

module.exports = { SongPlaylistLoadSchema }