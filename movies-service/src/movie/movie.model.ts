import * as mongoose from 'mongoose';
import { Movie } from './movie.interface';

const movieSchema = new mongoose.Schema<Omit<Movie, 'id'>>({
  title: String,
  runtime: Number,
  format: String,
  plot: String,
  releaseYear: Number,
  releaseMonth: Number,
  releaseDay: Number,
});

const MovieModel = mongoose.model<Movie & mongoose.Document>('Movie', movieSchema);

export default MovieModel;
