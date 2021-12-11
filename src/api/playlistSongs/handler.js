



const ClientError = require('../../exception/ClientError')
class PlaylistAddSongHandler {
    constructor(playlistservice, playlistSongService, validator) {

        this._playlistService = playlistservice;
        this._playlistSongService = playlistSongService;
        this._validator = validator

        this.postSongPlaylistHandler = this.postSongPlaylistHandler.bind(this)
        this.getSongPlaylistHandler = this.getSongPlaylistHandler.bind(this)
        this.deleteSongPlaylistHandler = this.deleteSongPlaylistHandler.bind(this)
    }

    async postSongPlaylistHandler(request, h) {
        try {
            console.log(request.payload)
            this._validator.validatePlaylistSongPayload(request.payload)
            const { id: credentialId } = request.auth.credentials;
            const { songId } = request.payload

            const { id: playlistId } = request.params
            console.log(typeof this._playlistService)
            await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)

            await this._playlistSongService.addSongPlaylist(playlistId, songId)

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan ke playlist',
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
        }
    }
    async getSongPlaylistHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;

            const { id: playlistId } = request.params

            await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)
            const songs = await this._playlistSongService.getSongPlaylist(playlistId)
            return {
                status: 'success',
                data: {
                    songs,
                },
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
            const response = h.response({
                status: 'fail',
                message: 'Maaf, terjadi kegagalan pada server kami.',
            });
            response.code(400);
            console.error(error);
        }
    }
    async deleteSongPlaylistHandler(request, h) {
        try {
            const { id: playlistId } = request.params
            const { id: credentialId } = request.auth.credentials;
            const { songId } = request.payload
            console.log(songId)
            await this._playlistService.verifyPlaylistOwner(playlistId, credentialId)
            await this._playlistSongService.deleteSongPlaylist(playlistId , songId)

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
module.exports = PlaylistAddSongHandler