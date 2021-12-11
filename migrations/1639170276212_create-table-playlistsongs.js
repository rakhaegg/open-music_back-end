/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlistsongs', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        playlist_id: {
          type: 'VARCHAR(50)',
          unique: true,
          notNull: true,
        },
        song_d : {
            type: 'VARCHAR(50)',
            notNull: true,
        }
      });

};

exports.down = pgm => {
    pgm.dropTable('playlistsongs');

};
