'use strict'

var express = require('express');
var router = express.Router();
var UrlSafeHolder = require('./urlSafety');
var pool = require('./db');


router.get('/', async function(req, res) {
  let EncryptLv = parseInt((req.query.p || '000').charAt(0));
  let UrlSafeLv = parseInt((req.query.p || '000').charAt(2));
  UrlSafeHolder.setCORS(UrlSafeLv>=1); UrlSafeHolder.setHTTPS(EncryptLv>=2);
  res.render('index', { title: 'Stretch Project', p: req.query.p || '000', h: req.query.h || '000' });
});

router.get('/rebuild', async function(req, res) {
  let EncryptLv = parseInt((req.query.p || '000').charAt(0));
  let UrlSafeLv = parseInt((req.query.p || '000').charAt(2));
  UrlSafeHolder.setCORS(UrlSafeLv>=1); UrlSafeHolder.setHTTPS(EncryptLv>=2);
  let connection;
  try {
    connection = await pool.getConnection();
    
    await connection.execute(`CREATE TABLE IF NOT EXISTS Movies (movieId INT PRIMARY KEY, title VARCHAR(255));`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS Genres (genreId INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100) UNIQUE);`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS MovieGenres (movieId INT,genreId INT,PRIMARY KEY (movieId, genreId),FOREIGN KEY (movieId) REFERENCES Movies(movieId),FOREIGN KEY (genreId) REFERENCES Genres(genreId));`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS Crew (movieId INT PRIMARY KEY,Director VARCHAR(100),TopTwoActors TEXT,releaseDate DATE,FOREIGN KEY (movieId) REFERENCES Movies(movieId));`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS Users (user VARCHAR(100) PRIMARY KEY,pass VARCHAR(100));`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS UsersHashed (user VARCHAR(100) PRIMARY KEY,pass VARCHAR(100));`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS Comments (commentId INT AUTO_INCREMENT PRIMARY KEY,writer VARCHAR(100),comment VARCHAR(255));`);
    /*
    await connection.execute(`LOAD DATA INFILE 'https://github.com/zcabeto/StretchProj/blob/main/data/cleaned_movies.csv' INTO TABLE Movies FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES (movieId, title);`);
    await connection.execute(`LOAD DATA INFILE '/var/lib/mysql-files/genres.csv' INTO TABLE Genres FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES (genreId, name);`);
    await connection.execute(`LOAD DATA INFILE '/var/lib/mysql-files/movie_genres.csv' INTO TABLE MovieGenres FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES (movieId, genreId);`);
    await connection.execute(`LOAD DATA INFILE '/var/lib/mysql-files/cleaned_crew.csv' INTO TABLE Crew FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;`);
    await connection.execute(`LOAD DATA INFILE '/var/lib/mysql-files/users.csv' INTO TABLE Users FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 ROWS;`);
    await connection.execute(`LOAD DATA INFILE '/var/lib/mysql-files/usersHashed.csv' INTO TABLE UsersHashed FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 ROWS;`);
    */
    res.render('index', { title: 'Stretch Project', p: req.query.p || '000', h: req.query.h || '000' });
  } catch (err) {
    console.error('Error from index/', err);
    res.render('error', { message: 'from index/', error: err});
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
