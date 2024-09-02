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
CREATE TABLE IF NOT EXISTS UsersHashed (
    user VARCHAR(100) PRIMARY KEY,
    pass VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Comments (
    commentId INT AUTO_INCREMENT PRIMARY KEY,
    writer VARCHAR(100),
    comment VARCHAR(255)
);

INSERT INTO Users(user, pass) VALUES ("u1", "p1");
INSERT INTO UsersHashed(user, pass) VALUES ("u1", "f64551fcd6f07823cb87971cfb91446425da18286b3ab1ef935e0cbd7a69f68a");
INSERT INTO Users(user, pass) VALUES ("versalord", "p1");
INSERT INTO UsersHashed(user, pass) VALUES ("versalord", "f64551fcd6f07823cb87971cfb91446425da18286b3ab1ef935e0cbd7a69f68a");
INSERT INTO Users(user, pass) VALUES ("naturen", "p1");
INSERT INTO UsersHashed(user, pass) VALUES ("naturen", "f64551fcd6f07823cb87971cfb91446425da18286b3ab1ef935e0cbd7a69f68a");
INSERT INTO Users(user, pass) VALUES ("rebecca black", "p1");
INSERT INTO UsersHashed(user, pass) VALUES ("rebecca black", "f64551fcd6f07823cb87971cfb91446425da18286b3ab1ef935e0cbd7a69f68a");
INSERT INTO Users(user, pass) VALUES ("jefferey goldineson", "p1");
INSERT INTO UsersHashed(user, pass) VALUES ("jefferey goldineson", "f64551fcd6f07823cb87971cfb91446425da18286b3ab1ef935e0cbd7a69f68a");

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

LOAD DATA INFILE '/var/lib/mysql-files/users.csv'
INTO TABLE Users
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;

LOAD DATA INFILE '/var/lib/mysql-files/usersHashed.csv'
INTO TABLE UsersHashed
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 ROWS;