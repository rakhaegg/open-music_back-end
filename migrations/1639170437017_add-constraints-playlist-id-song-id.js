/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addConstraint('playlistsongs' , 'fk_playlistsongs.playlist_id_playlist.id' , 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE' )

    pgm.addConstraint('playlistsongs' , 'fk_playlistsongs.song_id_song.id' , 'FOREIGN KEY(song_d) REFERENCES songs(id) ON DELETE CASCADE' )

    
};

exports.down = pgm => {
    pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.playlist_id_playlist.id');

    pgm.dropConstraint('playlistsongs', 'fk_playlistsongs.song_id_song.id');

    

};
