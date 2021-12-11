
const ClientError = require('../../exception/ClientError');

class PlaylistHander {
    constructor(service, validator) {
        this._service = service
        this._validator = validator



        this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
        this.getPlaylistHandler = this.getPlaylistHandler.bind(this)
        this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this)
    }

    async postPlaylistHandler(request, h) {
        console.log("asd")
        try {
            this._validator.validatePlaylistLoad(request.payload);
            const { name } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            const playlistId = await this._service.addPlaylist({
                name, owner: credentialId,
            });


            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    playlistId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                    status: 'fail',
                    message: error.message,
                });
                response.code(error.statusCode);
                return response;
            }
            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(400);
            console.error(error);
            return response;
        }
    }
    async getPlaylistHandler(request) {
        const { id: credentialId } = request.auth.credentials;
        const playlists = await this._service.getPlaylists(credentialId)

        return {
            status: 'success',
            data: {
                playlists,
            },
        };
    }
    async deletePlaylistHandler(request , h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const { id: playlistId } = request.params

            await this._service.verifyPlaylistOwner(playlistId, credentialId)
            await this._service.deletePlaylist(playlistId ,credentialId )
            return {
                status: 'success',
                message: 'Lagu berhasil dihapus dari playlist',
              };
        } catch (error) {
            if (error instanceof ClientError) {
                const response = h.response({
                  status: 'fail',
                  message: error.message,
                });
                response.code(error.statusCode);
                return response;
              }
        
              // Server ERROR!
              const response = h.response({
                status: 'error',
                message: 'Maaf, terjadi kegagalan pada server kami.',
              });
              response.code(500);
              console.error(error);
              return response;
        }


    }
}

module.exports = PlaylistHander