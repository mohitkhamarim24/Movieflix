import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  omdbId: { type: String, unique: true },
  title: String,
  year: Number,
  genre: [String],
  director: String,
  actors: [String],
  rating: Number,
  runtime: Number,
  poster: String,
  fetchedAt: { type: Date, default: Date.now } // for TTL cleanup
});

export const Movie = mongoose.model("Movie", movieSchema);