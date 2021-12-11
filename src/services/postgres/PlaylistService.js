

const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exception/InvariantError');
const { mapDBtoMode_playlsits } = require('../../utils')

const NotFoundError = require('../../exception/NotFoundError')
const AuthorizationError = require('../../exception/AuthorizationError')
const NotFoundPlaylistError = require('../../exception/NotFoundPlaylist')

class PlaylistService {
    constructor() {
        this._pool = new Pool()
    }

    async addPlaylist({ name, owner }) {
        const id = "playlist-" + nanoid(16)

        console.log(name, owner)
        const query = {
            text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist failed added')
        }

        return result.rows[0].id
    }
    async getPlaylists(owner) {
        const query = {
            text: `SELECT playlists.id , playlists.name , users.username
            FROM playlists INNER JOIN users ON playlists.owner = users.id 
            WHERE playlists.owner = $1
            `,
            values: [owner],
        };
        console.log(owner)
        const result = await this._pool.query(query);

        const isEmpty = result.rows.map(mapDBtoMode_playlsits).length == 0
        if (isEmpty) {
            return []
        } else {
            console.log(result.rows.map(mapDBtoMode_playlsits))
            return result.rows.map(mapDBtoMode_playlsits)
        }
    }
    async deletePlaylist(playlist_id , owner){
        const query = {
            text : 'DELETE FROM playlists WHERE id = $1 AND owner = $2  RETURNING id ',
            values : [playlist_id , owner]
        }
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundPlaylistError('Id tidak ditemukan');
        }
    }
    async verifyPlaylistAccess(playlist_id, userId) {
        try {
            await this.verifyPlaylistOwner(playlist_id , userId)
        } catch (error) {

        }
    }
    async verifyPlaylistOwner(id, owner) {
        console.log(id , owner)
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],
        };
        
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }
        const note = result.rows[0];
        if (note.owner !== owner) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }
    
        
    


}
module.exports = PlaylistService