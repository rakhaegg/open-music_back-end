

const { Pool } = require('pg')
const { nanoid} = require('nanoid')
const InvariantError = require('../../exception/InvariantError');
const AuthorizationError = require('../../exception/AuthorizationError');

const {  mapDBtoModelbyID , mapDBtoModel } = require('../../utils')
const NotFoundError = require('../../exception/NotFoundError');

class SongService {
    constructor(){
        this._pool = new Pool()
    }
    async verifyNoteOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
          };
          const result = await this._pool.query(query);
          if (!result.rows.length) {
            throw new NotFoundError('Catatan tidak ditemukan');
          }
          const note = result.rows[0];
          if (note.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
          }
    }

    async addSong({title , year , performer , genre , duration , owner}){
        const id = "song-" + nanoid(16)
        const createdAt = new Date().toISOString()
        const updatedAt = createdAt

        const query = {
            text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6 , $7 , $8 , $9) RETURNING id',
            values: [id, title, year, performer , genre , duration, createdAt, updatedAt , owner],
        };
        
        const result = await this._pool.query(query)

        if (!result.rows[0].id){
            throw new InvariantError('Song failed added')
        }

        return result.rows[0].id

    }
    async getSongs(owner){
        const query = {
            text: 'SELECT * FROM songs WHERE owner = $1',
            values: [owner],
          };
        const result = await this._pool.query(query);
        const isEmpty = result.rows.map(mapDBtoModel).length == 0
        if(isEmpty){
            return []
        }else{  
            
            
                
            return result.rows.map(songs => ({ id : songs.id , title : songs.title , performer : songs.performer}))

        }
 
    }

    async getSongById(id){
        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Song not found');
        }

        return result.rows.map(mapDBtoModelbyID)[0];
    }

    async editSongByid(id , { title, year, performer , genre , duration}){
        const updatedAt = new Date().toISOString();
     
        const query = {
          text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4 , duration  = $5, updated_at = $6 WHERE id = $7 RETURNING id',
          values: [title, year, performer, genre, duration , updatedAt , id],
        };

        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Song nout found');
          }

    }

    async deleteSongById(id) {
        const query = {
          text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
          values: [id],
        };
        
        const result = await this._pool.query(query);
        /*
            * Seperti biasa, periksa nilai result.rows bila nilainya 0 (false) maka bangkitkan NotFoundError. 
            * Fungsi ini juga tidak perlu mengembalikan nilai apa pun.

        */
        if (!result.rows.length) {
          throw new NotFoundError('Song not found');
        }
      }
      
}
module.exports =  SongService

