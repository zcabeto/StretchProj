'use strict'

var express = require('express');
var router = express.Router();
var pool = require('./db');
var InputSanitizer = require('./inputsanitizer');

router.get('/', async function(req, res) {
  let EncryptLv = parseInt((req.query.p || '000').charAt(0));
  let InSafeLv = parseInt((req.query.p || '000').charAt(1));
  let UrlSafe = parseInt((req.query.p || '000').charAt(2));
  let connection;
  try {
    connection = await pool.getConnection();

    let genreId; let itemNum;
    let searchQuery = InputSanitizer.sanitizeString(req.query.s || '', InSafeLv);
    if (UrlSafe >= 2) {
      genreId = parseInt(InputSanitizer.sanitizeString(req.cookies['GenreId'] || '0'), InSafeLv);
      itemNum = parseInt(InputSanitizer.sanitizeString(req.cookies['ItemNum'] || '0'), InSafeLv);
    } else {
      genreId = parseInt(InputSanitizer.sanitizeString(req.query.g || '0'), InSafeLv);
      itemNum = parseInt(InputSanitizer.sanitizeString(req.query.i || '0'), InSafeLv);
    }
    if (itemNum < 0) itemNum = 0;
      
    let movies; let fields; let getMovies;
    if (genreId == 0){
      getMovies = `(SELECT DISTINCT Movies.title, Crew.* FROM Movies INNER JOIN Crew ON Movies.movieId=Crew.movieId WHERE Movies.title LIKE '%${searchQuery}%' OR Crew.Director LIKE '%${searchQuery}%' OR Crew.TopTwoActors LIKE '%${searchQuery}%' LIMIT ${itemNum},30);`;
    } else {
      getMovies = `(SELECT DISTINCT MoviesInGenre.title, Crew.* FROM (SELECT Movies.* FROM Movies INNER JOIN MovieGenres ON Movies.movieId=MovieGenres.movieId WHERE MovieGenres.genreId=${genreId}) AS MoviesInGenre INNER JOIN Crew ON MoviesInGenre.movieId=Crew.movieId WHERE MoviesInGenre.title LIKE '%${searchQuery}%' OR Crew.Director LIKE '%${searchQuery}%' OR Crew.TopTwoActors LIKE '%${searchQuery}%' LIMIT ${itemNum},30);`;
    }
    if (EncryptLv >= 1) { getMovies = getMovies.replace('Users', 'UsersHashed'); }
    const getMoviesPromise =  connection.execute(getMovies);
    [movies, fields] = await Promise.race([getMoviesPromise, new Promise((resolve, reject) => setTimeout(() => reject(new Error("Query timeout")), 1000))]);
    if (movies.length == 0) {
      itemNum -= 30;
    }

    movies.forEach(movie => {
      if (movie.releaseDate) {
        const date = new Date(movie.releaseDate);
        const formattedDate = date.toLocaleDateString('en-GB');
        movie.releaseDate = formattedDate;
      }
    });

    const getGenre = `
      SELECT * 
      FROM Genres
      ORDER BY genreId;
    `;
    const getGenresPromise = connection.execute(getGenre);
    const [genres, fieldsG] = await Promise.race([getGenresPromise, new Promise((resolve, reject) => setTimeout(() => reject(new Error("Query timeout")), 1000))]);

      // render the data
    res.render('data', { title: 'Film Table Data', 
      data: movies, genres: genres, genreShown: genreId,
      allCols: fields.map(field => field.name),
      searchQuery: searchQuery, itemNum: itemNum, p: req.query.p || '000', h: req.query.h || '000' });
  } catch (err) {
    console.error('Error from data/', err);
    res.render('error', { message: 'from data/', error: err});
  } finally {
    if (connection) connection.release();
  }
})

module.exports = router;