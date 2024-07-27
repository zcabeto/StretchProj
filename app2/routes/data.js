'use strict'
var express = require('express');
var router = express.Router();
var pool = require('./db');     // retrieve pool from db.js
var InputSanitizer = require('./inputsanitizer');
var LoginProcessor = require('./login');

router.get('/', async function(req, res) {
  let connection;
  try {
    if (LoginProcessor.ACCEPT) {
      connection = await pool.getConnection();

      let searchQuery = InputSanitizer.sanitizeString(req.query.searchQuery || '%');
      let genreId = parseInt(InputSanitizer.sanitizeString(req.query.genreId || '0'));
      let itemNum = parseInt(InputSanitizer.sanitizeString(req.query.itemNum || '0'));
      if (itemNum < 0) itemNum = 0;
      
      let movies; let fields;
      if (genreId == 0){
        let getMovies = `
          SELECT DISTINCT Movies.title, Crew.*
          FROM Movies 
            INNER JOIN Crew ON Movies.movieId=Crew.movieId 
            INNER JOIN Tags ON Movies.movieId=Tags.movieId
          WHERE Movies.title LIKE ? OR Crew.Director LIKE ? OR Crew.TopTwoActors LIKE ?
          LIMIT ?,30;
        `;
        [movies, fields] = await connection.execute(getMovies, [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `${itemNum}`]);
        if (movies.length == 0) {
          itemNum -= 30;
          [movies, fields] = await connection.execute(getMovies, [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `${itemNum}`]);
        }
      } else {
        let getMovies = `
          SELECT DISTINCT MoviesInGenre.title, Crew.*
          FROM 
            (SELECT Movies.* FROM Movies INNER JOIN MovieGenres ON Movies.movieId=MovieGenres.movieId WHERE MovieGenres.genreId = ?) AS MoviesInGenre
            INNER JOIN Crew ON MoviesInGenre.movieId=Crew.movieId 
            INNER JOIN Tags ON MoviesInGenre.movieId=Tags.movieId
          WHERE MoviesInGenre.title LIKE ? OR Crew.Director LIKE ? OR Crew.TopTwoActors LIKE ?
          LIMIT ?,30;
        `;
        [movies, fields] = await connection.execute(getMovies, [`${genreId}`,`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `${itemNum}`]);
        if (movies.length == 0) {
          itemNum -= 30;
          [movies, fields] = await connection.execute(getMovies, [`${genreId}`,`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `${itemNum}`]);
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
        searchQuery: searchQuery, itemNum: itemNum, ACCEPT: true });
    } else {
      res.render('data', { title: 'Film Table Data', ACCEPT: false });
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