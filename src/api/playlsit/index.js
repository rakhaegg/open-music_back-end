const PlaylistHander = require ('./handler')

const routes = require('./routes')


module.exports = {
    name: 'playlist',
    version: '1.0.0',
    register: async (server, { service , validator }) => {
      const playlistHandler = new PlaylistHander(service , validator);
      server.route(routes(playlistHandler));
    },
}