/*
  * Menampung function handler pada route


*/
const ClientError = require('../../exception/ClientError');


class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByHandler = this.putSongByHandler.bind(this)
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
  }

  

  async postSongHandler(request, h) {
    try {
     
      this._validator.validateSongPayload(request.payload);
      const { title , year , performer , genre , duration } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const songId = await this._service.addSong({ 
          title, year, performer , genre , duration ,owner: credentialId,
        });

     
      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log("asd")
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

  async getSongsHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const songs = await this._service.getSongs(credentialId)
    console.log(songs.length)
     
    return {
      status: 'success',
      data: {
        songs
      }
    };
  }

  
  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyNoteOwner(id, credentialId);
      const song = await this._service.getSongById(id);
      return {
        status: 'success',
        data: {
          song,
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


  async putSongByHandler(request, h) {
  
    try {
      this._validator.validateSongPayload(request.payload);
      //const { title, year, performer , genre , duration  } = request.payload
      const { id } = request.params;
      const { id: credentialId} = request.auth.credentials;

      await this._service.verifyNoteOwner(id, credentialId);
      await this._service.editSongByid(id, request.payload);
      return {
        status: 'success',
        message: 'Catatan berhasil diperbarui',
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
      response.code(400);
      console.error(error);
      return response;
    }
  }
  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyNoteOwner(id, credentialId);
      await this._service.deleteSongById(id); 
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
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
module.exports = SongHandler;