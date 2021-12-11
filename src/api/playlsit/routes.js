

const routes = (handler) => [
    {   
        method : 'POST',
        path : '/playlists',
        handler : handler.postPlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
          },
        
    },
    {
        method : 'GET',
        path : '/playlists',
        handler : handler.getPlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
          },
    },
    {
        method : 'DELETE',
        path : '/playlists/{id}',
        handler : handler.deletePlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
          },
    },  
    
   
]


module.exports = routes