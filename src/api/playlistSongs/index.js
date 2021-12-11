const PlaylistAddSongHandler = require ('./handler')

const routes = require('./routes')


module.exports = {
    name: 'playlist_song',
    version: '1.0.0',
    register: async (server, { playlistservice ,playlistSongService  , validator }) => {
      const playlist_song = new PlaylistAddSongHandler(playlistservice , playlistSongService , validator);
      server.route(routes(playlist_song));
    },
}