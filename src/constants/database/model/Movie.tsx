import {IMovie} from '../../../model';
import db from '../db';

export const addMovie = (movie: IMovie): void => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO Movies (id, type, isFavorite, attributes) VALUES (?, ?, ?, ?)',
      [
        movie.id,
        movie.type,
        movie.isFavorite ? 1 : 0,
        JSON.stringify(movie.attributes),
      ],
      () => {
        console.log('Movie added successfully');
      },
      error => {
        console.log('Error adding movie: ', error);
      },
    );
  });
};

export const movieExists = (
  id: string,
  callback: (exists: boolean) => void,
): void => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT COUNT(*) as count FROM Movies WHERE id = ?',
      [id],
      (tx, results) => {
        const count = results.rows.item(0).count;
        callback(count > 0);
      },
      error => {
        console.log('Error checking if movie exists: ', error);
        callback(false);
      },
    );
  });
};

export const getMovieById = (id: string): Promise<IMovie | null> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM Movies WHERE id = ?',
        [id],
        (tx, results) => {
          if (results.rows.length > 0) {
            const movieData = results.rows.item(0);
            resolve({
              id: movieData.id,
              type: movieData.type,
              isFavorite: movieData.isFavorite === 1,
              attributes: JSON.parse(movieData.attributes),
            });
          } else {
            resolve(null);
          }
        },
        (tx, error) => {
          console.log('Error fetching movie by id: ', error);
          reject(error);
        }
      );
    });
  });
};

export const getMovies = (callback: (movies: IMovie[]) => void): void => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM Movies',
      [],
      (tx, results) => {
        const rows = results.rows;
        const movies: IMovie[] = [];

        for (let i = 0; i < rows.length; i++) {
          const movie = rows.item(i);
          movies.push({
            id: movie.id,
            type: movie.type,
            isFavorite: movie.isFavorite === 1,
            attributes: JSON.parse(movie.attributes),
          });
        }

        callback(movies);
      },
      (tx, error) => {
        console.log('Error fetching movies: ', error);
      },
    );
  });
};
export const updateMovie = (movie: IMovie): void => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE Movies SET type = ?, isFavorite = ?, attributes = ? WHERE id = ?',
      [
        movie.type,
        movie.isFavorite ? 1 : 0,
        JSON.stringify(movie.attributes),
        movie.id,
      ],
      () => {
        console.log('Movie updated successfully');
      },
      error => {
        console.log('Error updating movie: ', error);
      },
    );
  });
};
