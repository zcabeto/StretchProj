'use strict'

var express = require('express');
var router = express.Router();
var pool = require('./db');
var InputSanitizer = require('./inputsanitizer');
var LoginProcessor = require('./login');

router.get('/', async function(req, res) {
  let help = parseInt((req.query.p || '0000').charAt(0));
  let isHashed = parseInt((req.query.p || '0000').charAt(1));
  let SQLI = parseInt((req.query.p || '0000').charAt(2));
  let XSS = parseInt((req.query.p || '0000').charAt(3));
  let connection;
  try {
    if (LoginProcessor.ACCEPT) {
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
        /*let getMovies = `
          (SELECT DISTINCT Movies.title, Crew.*
          FROM Movies 
            INNER JOIN Crew ON Movies.movieId=Crew.movieId 
          WHERE Movies.title LIKE '%${searchQuery}%' OR Crew.Director LIKE '%${searchQuery}%' OR Crew.TopTwoActors LIKE '%${searchQuery}%'
          LIMIT ${itemNum},30);
        `;*/
        if (isHashed) { getMovies = getMovies.replace('Users', 'UsersHashed'); }
        [movies, fields] = await connection.execute(getMovies);
        if (movies.length == 0) {
          itemNum -= 30;
          [movies, fields] = await connection.execute(getMovies);
        }
      } else {
        let getMovies = `(SELECT DISTINCT MoviesInGenre.title, Crew.* FROM (SELECT Movies.* FROM Movies INNER JOIN MovieGenres ON Movies.movieId=MovieGenres.movieId WHERE MovieGenres.genreId=${genreId}) AS MoviesInGenre INNER JOIN Crew ON MoviesInGenre.movieId=Crew.movieId WHERE MoviesInGenre.title LIKE '%${searchQuery}%' OR Crew.Director LIKE '%${searchQuery}%' OR Crew.TopTwoActors LIKE '%${searchQuery}%' LIMIT ${itemNum},30);`;
        /*let getMovies = `
          (SELECT DISTINCT MoviesInGenre.title, Crew.*
          FROM 
            (SELECT Movies.* FROM Movies INNER JOIN MovieGenres ON Movies.movieId=MovieGenres.movieId WHERE MovieGenres.genreId=${genreId}) AS MoviesInGenre
            INNER JOIN Crew ON MoviesInGenre.movieId=Crew.movieId 
          WHERE MoviesInGenre.title LIKE '%${searchQuery}%' OR Crew.Director LIKE '%${searchQuery}%' OR Crew.TopTwoActors LIKE '%${searchQuery}%'
          LIMIT ${itemNum},30);
        `;*/
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
        searchQuery: searchQuery, itemNum: itemNum, p: help.toString()+isHashed.toString()+SQLI.toString()+XSS.toString() });
    } else {
      res.render('data', { title: 'Film Table Data', p: help.toString()+isHashed.toString()+SQLI.toString()+XSS.toString() });
    }
  } catch (err) {
    console.error('Error from data/', err);
    res.render('error', { message: 'from data/', error: err});
  } finally {
    if (connection) connection.release();
  }
})

function add_or_remove(allEls, shownEls, element){
  const index = shownEls.indexOf(element);
  if (allEls.indexOf(element)==-1) return shownEls;
  if (index == -1){
    // re-add the element in its original position
    let newShown = [];
    for (var i=0; i<allEls.length; i++){
      if (shownEls.includes(allEls[i]) || allEls[i]==element){
        newShown.push(allEls[i]);
      }
    }
    return newShown;
  } else {
    // remove the element
    shownEls.splice(index, 1);
    return shownEls;
  }
}

module.exports = router;