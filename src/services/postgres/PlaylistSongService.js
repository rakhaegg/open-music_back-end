
const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exception/InvariantError');
const NotFoundError = require('../../exception/NotFoundError')
const AuthorizationError = require('../../exception/AuthorizationError')
const NotFoundPlaylistError = require('../../exception/NotFoundPlaylist')

class PlaylistSong {
    constructor() {
        this._pool = new Pool()

    }

    async addSongPlaylist(playlist_id, song_Id) {
        const id = "playlistSongs" + nanoid(16)
        console.log(song_Id)
        const query = {
            text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
            values: [id, playlist_id, song_Id],
        };
        const result = await this._pool.query(query)

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist failed added')
        }
    }
    async getSongPlaylist(playlist_id) {
        const query = {
            text: `SELECT songs.id , songs.title , songs.performer FROM songs LEFT JOIN playlistsongs ON 
            playlistsongs.song_d = songs.id  WHERE playlistsongs.playlist_id = $1  
          `,
            values: [playlist_id]
        };
        const result = await this._pool.query(query)
        return result.rows.map(playlist => ({ id: playlist.id, title: playlist.title, performer: playlist.performer }))
    }
    async deleteSongPlaylist(playlist_id , song_id) {
        console.log(playlist_id)
        console.log(song_id)
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_d = $2  RETURNING id',
            values: [playlist_id , song_id],
        };
        const result = await this._pool.query(query);

        if (!result.rows.length) {
            throw new NotFoundPlaylistError('Id tidak ditemukan');
        }
    }
}

module.exports = PlaylistSong