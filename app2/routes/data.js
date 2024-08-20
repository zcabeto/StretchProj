'use strict'

var express = require('express');
var router = express.Router();
var pool = require('./db');
var InputSanitizer = require('./inputsanitizer');

router.get('/', async function(req, res) {
  let isHashed = parseInt((req.query.p || '000').charAt(0));
  let SQLI = parseInt((req.query.p || '000').charAt(1));
  let connection;
  try {
    connection = await pool.getConnection();

    let searchQuery; let genreId; let itemNum;
    if (SQLI) {
      searchQuery = InputSanitizer.sanitizeString(req.query.s || '');
      genreId = parseInt(InputSanitizer.sanitizeString(req.query.g || '0'));
      itemNum = parseInt(InputSanitizer.sanitizeString(req.query.i || '0'));
    } else {
      searchQuery = req.query.s || '';
      genreId = req.query.g || '0';
      itemNum = req.query.i || '0';
    }
    if (itemNum < 0) itemNum = 0;
      
    let movies; let fields;
    if (genreId == 0){
      let getMovies = `(SELECT DISTINCT Movies.title, Crew.* FROM Movies INNER JOIN Crew ON Movies.movieId=Crew.movieId WHERE Movies.title LIKE '%${searchQuery}%' OR Crew.Director LIKE '%${searchQuery}%' OR Crew.TopTwoActors LIKE '%${searchQuery}%' LIMIT ${itemNum},30);`;
      if (isHashed) { getMovies = getMovies.replace('Users', 'UsersHashed'); }
      [movies, fields] = await connection.execute(getMovies);
      if (movies.length == 0) {
        itemNum -= 30;
        [movies, fields] = await connection.execute(getMovies);
      }
    } else {
      let getMovies = `(SELECT DISTINCT MoviesInGenre.title, Crew.* FROM (SELECT Movies.* FROM Movies INNER JOIN MovieGenres ON Movies.movieId=MovieGenres.movieId WHERE MovieGenres.genreId=${genreId}) AS MoviesInGenre INNER JOIN Crew ON MoviesInGenre.movieId=Crew.movieId WHERE MoviesInGenre.title LIKE '%${searchQuery}%' OR Crew.Director LIKE '%${searchQuery}%' OR Crew.TopTwoActors LIKE '%${searchQuery}%' LIMIT ${itemNum},30);`;
      if (isHashed) { getMovies = getMovies.replace('Users', 'UsersHashed'); }
      [movies, fields] = await connection.execute(getMovies);
      if (movies.length == 0) {
        itemNum -= 30;
        [movies, fields] = await connection.execute(getMovies);
      }
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
    const [genres, fieldsG] = await connection.execute(getGenre);

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