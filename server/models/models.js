import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, unique: true },
  img: { type: DataTypes.STRING, },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "USER" },
})

const Artist = sequelize.define("artist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  spotifyId: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  imgUrl: { type: DataTypes.STRING },
  followersCount: { type: DataTypes.INTEGER, defaultValue: 0 },
})

const Album = sequelize.define(
  "album",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    spotifyId: { type: DataTypes.STRING, unique: true, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    imgUrl: { type: DataTypes.STRING},
    artistId: { type: DataTypes.INTEGER, allowNull: false },
    releaseDate: { type: DataTypes.DATE },
    totalTracks: { type: DataTypes.INTEGER },
  },
  {
    indexes: [{ unique: true, fields: ["title", "artistId"] }],
  },
)

const Song = sequelize.define("song", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  spotifyId: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  imgUrl: { type: DataTypes.STRING, allowNull: false },
  durationMs: { type: DataTypes.INTEGER, allowNull: false },
  timesPlayed: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalLikes: { type: DataTypes.INTEGER, defaultValue: 0 },
  trackNumber: { type: DataTypes.INTEGER },
  albumId: { type: DataTypes.INTEGER },
  audioFeatures: { type: DataTypes.JSONB },
  embedding: { type: DataTypes.ARRAY(DataTypes.FLOAT) }
})

const Playlist = sequelize.define("playlist", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  img: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING },
  userId: { type: DataTypes.INTEGER, allowNull: false },
})

const Likes = sequelize.define("likes", {
  userId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  songId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
})

const History = sequelize.define("history", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  playedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  songId: { type: DataTypes.INTEGER, allowNull: false },
})

const SongArtists = sequelize.define("song_artists", {
  songId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  artistId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
})

const PlaylistTracks = sequelize.define("playlist_tracks", {
  playlistId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  songId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  position: { type: DataTypes.INTEGER },
})

const UserFollowers = sequelize.define("user_followers", {
  followerId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  followingId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
});

const ArtistFollowers = sequelize.define("artist_followers", {
  userId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  artistId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
})

const AlbumLikes = sequelize.define("album_likes", {
  userId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
  albumId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
})

User.hasMany(Likes)
Likes.belongsTo(User)

User.hasMany(Playlist)
Playlist.belongsTo(User)

User.hasMany(History)
History.belongsTo(User)

Artist.hasMany(Album)
Album.belongsTo(Artist)

Album.hasMany(Song)
Song.belongsTo(Album)

Song.hasMany(Likes)
Likes.belongsTo(Song)

Song.hasMany(History)
History.belongsTo(Song)

Song.belongsToMany(Artist, {
    through: SongArtists,
    as: 'artists',
    foreignKey: 'songId',
    otherKey: 'artistId'
})

Artist.belongsToMany(Song, {
    through: SongArtists,
    as: 'songs',
    foreignKey: 'artistId',
    otherKey: 'songId'
})

Playlist.belongsToMany(Song, { 
    through: PlaylistTracks,
    as: 'songs',
    foreignKey: 'playlistId',
    otherKey: 'songId'
})

Song.belongsToMany(Playlist, { 
    through: PlaylistTracks,
    as: 'playlists',
    foreignKey: 'songId',
    otherKey: 'playlistId'
})

User.belongsToMany(Artist, {
    through: ArtistFollowers,
    as: 'followingArtists',
    foreignKey: 'userId',
    otherKey: 'artistId'
})

Artist.belongsToMany(User, {
    through: ArtistFollowers,
    as: 'followersArtists',
    foreignKey: 'artistId',
    otherKey: 'userId'
})

User.belongsToMany(User, {
  through: UserFollowers,
  as: "followers",
  foreignKey: "followingId",
  otherKey: "followerId",
})

User.belongsToMany(User, {
  through: UserFollowers,
  as: "following",
  foreignKey: "followerId",
  otherKey: "followingId",
})

User.belongsToMany(Album, {
  through: AlbumLikes, 
  as: 'likedAlbums', 
  foreignKey: 'userId', 
  otherKey: 'albumId' 
})

Album.belongsToMany(User, {
   through: AlbumLikes, 
   as: 'likedBy', 
   foreignKey: 'albumId', 
   otherKey: 'userId' 
  })

export default {
  User,
  Artist,
  Album,
  Song,
  Playlist,
  Likes,
  History,
  SongArtists,
  PlaylistTracks,
  UserFollowers,
  ArtistFollowers,
  AlbumLikes
};
