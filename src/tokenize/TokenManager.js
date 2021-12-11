
/*
    Parameter payload merupakan objek yang disimpan ke dalam salah satu artifacts JWT. 
    Biasanya objek payload berisi properti yang mengindikasikan identitas pengguna, 

    Kemudian kembalikan fungsi ini dengan JWT token yang dibuat menggunakan fungsi 
    JWT.token.generate() dari package @hapi/jwt.
*/
const Jwt = require('@hapi/jwt');
const TokenManager = {
    generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
    generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),

    /* 
        * Fungsi verifySignature ini akan mengecek apakah refresh token memiliki signature yang sesuai atau tidak. Jika hasil verifikasi sesuai, 
        * fungsi ini akan lolos. Namun bila tidak, maka fungsi ini akan membangkitkan eror.
        * Agar tidak menimbulkan server eror, kita tangani seluruh fungsi verifyRefreshToken dengan try dan catch seperti ini:

    */
    verifyRefreshToken: (refreshToken) => {
        try {
            const artifacts = Jwt.token.decode(refreshToken);
            Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
            const { payload } = artifacts.decoded;
            return payload;
          } catch (error) {
            throw new InvariantError('Refresh token tidak valid');
          }
      },
};
 
module.exports = TokenManager;