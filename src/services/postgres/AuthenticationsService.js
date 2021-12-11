
/*

    * AuthenticationService ini akan bertanggung jawab dalam menangani pengelolaan data refresh token pada tabel authentications melalui fungsi-fungsi:
    * Memasukkan refresh token (addRefreshToken).
    * Memverifikasi atau memastikan refresh token ada di database (verifyRefreshToken).
    * Menghapus refresh token (deleteRefreshToken).


*/
const InvariantError = require('../../exception/InvariantError');
const { Pool } = require('pg');
     
class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  // * Buat fungsi asynchronous bernama addRefreshToken yang menerima satu parameter string yakni token.
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };
 
    await this._pool.query(query);
  }

  // * Buat fungsi asynchronous bernama verifyRefreshToken yang menerima satu parameter string yakni token.
  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };
    console.log(token)
    const result = await this._pool.query(query);
 
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  // * Buat fungsi asynchronous bernama deleteRefreshToken yang menerima satu parameter string yakni token.

  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };
 
    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService