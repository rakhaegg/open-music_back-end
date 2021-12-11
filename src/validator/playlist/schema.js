

const Joi = require('joi')

const PlaylistLoadSchema = Joi.object(

    {
        name : Joi.string().required()
    }

)

module.exports = { PlaylistLoadSchema }