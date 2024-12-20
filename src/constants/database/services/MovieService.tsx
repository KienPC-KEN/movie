import {IMovie} from '../../../model';
import {
  addMovie,
  getMovieById,
  getMovies,
  movieExists,
  updateMovie,
} from '../model/Movie';

export const addMovieFovirte = (movie: IMovie): void => {
  movieExists(movie.id, exists => {
    if (!exists) {
      const isFavorite = false;
      addMovie({...movie, isFavorite});
    } else {
      console.log(
        `Movie with id ${movie.id} already exists, skipping addition.`,
      );
    }
  });
};

export const fetchAllMovie = (callback: (movies: IMovie[]) => void): void => {
  getMovies(callback);
};

export const fetchMovieById = async (id: string): Promise<IMovie | null> => {
  try {
    const movie = await getMovieById(id);
    return movie;
  } catch (error) {
    console.error('Error fetching movie by id: ', error);
    return null;
  }
};

export const updateMovieFavorite = (movie: IMovie): void => {
  const isFavorite = movie.isFavorite;
  updateMovie({...movie, isFavorite});
};
