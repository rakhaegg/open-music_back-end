
const routes = (handler) => [
    {
        method: 'POST',
        path: '/playlists/{id}/songs',
        handler: handler.postSongPlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs',
        handler: handler.getSongPlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}/songs',
        handler: handler.deleteSongPlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
]

module.exports  = routes