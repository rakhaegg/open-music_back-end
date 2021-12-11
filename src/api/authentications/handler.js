

const ClientError = require('../../exception/ClientError');

const AuthorizationError = require('../../exception/AuthorizationError');
class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  // * 
  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);

      const { username, password } = request.payload;
      // * memverifikasi kredensial selesai, kita bisa lanjutkan dengan membuat access token dan refresh token
      const id = await this._usersService.verifyUserCredential(username, password);


      // *  Untuk membuat kedua token tersebut
      const accessToken = this._tokenManager.generateAccessToken({ id });
      const refreshToken = this._tokenManager.generateRefreshToken({ id });

      /*
          Setelah accessToken dan refreshToken terbuat, kita akan gunakan keduanya 
          sebagai nilai data yang nantinya dibawa oleh body respons. Namun sebelum itu, 
          kita perlu menyimpan dulu refreshToken ke database agar server mengenali refreshToken 
          bila pengguna ingin memperbarui accessToken.

      */
      await this._authenticationsService.addRefreshToken(refreshToken);

      const response = h.response({
        status: 'success',
        message: 'Authentication berhasil ditambahkan',
        data: {
          accessToken,
          refreshToken,
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
      } else if (error instanceof AuthorizationError) {
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


  // * fungsi handler ini akan dijalankan ketika ada request ke PUT /authentications, 
  // * di mana request tersebut dilakukan untuk memperbarui access token dengan melampirkan 
  // * refresh token pada payload request. 
  async putAuthenticationHandler(request, h) {
    try {
      // * memastikan payload request mengandung properti refreshToken yang bernilai string.
      this._validator.validatePutAuthenticationPayload(request.payload);
    
      const { refreshToken } = request.payload;
      // *  nilai refreshToken pada request.payload dan verifikasi refreshToken 
      // * baik dari sisi database maupun signature token. 
      console.log(refreshToken)
      await this._authenticationsService.verifyRefreshToken(refreshToken);
    
      const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
      // * membuat accessToken baru dan melampirkannya sebagai data di body respons.
      const accessToken = this._tokenManager.generateAccessToken({ id });
      return {
        status: 'success',
        message: 'Access Token berhasil diperbarui',
        data: {
          accessToken,
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

  // *  menghapus refresh token yang dimiliki pengguna pada database.
  async deleteAuthenticationHandler(request, h) {
    try {
      // * , pastikan permintaan membawa payload yang berisi refreshToken. 
      // * Untuk validasinya, kita gunakan fungsi validateDeleteAuthenticationsPayload
      this._validator.validateDeleteAuthenticationPayload(request.payload);


      // * sebelum menghapusnya kita perlu memastikan refreshToken tersebut ada di database.
      const { refreshToken } = request.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return {
        status: 'success',
        message: 'Refresh token berhasil dihapus',
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
module.exports = AuthenticationsHandler