DROP DATABASE MovieLens;
CREATE DATABASE IF NOT EXISTS MovieLens;

USE MovieLens;

CREATE TABLE IF NOT EXISTS Movies (
    movieId INT PRIMARY KEY,
    title VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Genres (
    genreId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS MovieGenres (
    movieId INT,
    genreId INT,
    PRIMARY KEY (movieId, genreId),
    FOREIGN KEY (movieId) REFERENCES Movies(movieId),
    FOREIGN KEY (genreId) REFERENCES Genres(genreId)
);

CREATE TABLE IF NOT EXISTS Crew (
    movieId INT PRIMARY KEY,
    Director VARCHAR(100),
    TopTwoActors TEXT,
    releaseDate DATE ,
    FOREIGN KEY (movieId) REFERENCES Movies(movieId)
);

CREATE TABLE IF NOT EXISTS Users (
    user VARCHAR(100) PRIMARY KEY,
    pass VARCHAR(100)
);

INSERT INTO Users(user, pass) VALUES ("u1", "p1");

LOAD DATA INFILE '/var/lib/mysql-files/cleaned_movies.csv'
INTO TABLE Movies
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES
(movieId, title);

LOAD DATA INFILE '/var/lib/mysql-files/genres.csv'
INTO TABLE Genres
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(genreId, name);

LOAD DATA INFILE '/var/lib/mysql-files/movie_genres.csv'
INTO TABLE MovieGenres
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(movieId, genreId);

LOAD DATA INFILE '/var/lib/mysql-files/cleaned_crew.csv'
INTO TABLE Crew
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;