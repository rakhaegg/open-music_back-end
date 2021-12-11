
require('dotenv').config();

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt');

const songs = require('./api/songs')
const SongsService = require('./services/postgres/SongService')
const SongValidator = require('./validator/songs')


// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UserService');
const UsersValidator = require('./validator/users');


// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authetications');


//playlist 
const playlist = require('./api/playlsit')
const PlaylistService = require('./services/postgres/PlaylistService')
const PlaylistValidator = require('./validator/playlist')


//PlaylistSong
const playlist_song = require('./api/playlistSongs')
const PlaylistSong = require('./services/postgres/PlaylistSongService')
const PlaylistSongValidator = require('./validator/songPlaylist')

const init = async () => {
    const playlistservice = new PlaylistService()
    const playlistSongService = new PlaylistSong()
    const songService = new SongsService()
   
    const usersService = new UsersService();

    const authenticationsService = new AuthenticationsService();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    })
    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
    ]);
    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('songsapp_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });
    await server.register([
        {
            plugin: songs,
            options: {  
                service: songService,
                validator: SongValidator,
            },
        },
       
        {
            plugin: playlist_song,
            options: {
                playlistservice : playlistservice,
                playlistSongService : playlistSongService,
                validator: PlaylistSongValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },

        {
            plugin: playlist,
            options: {  
                service: playlistservice,
                validator: PlaylistValidator,
            },
        },

    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();