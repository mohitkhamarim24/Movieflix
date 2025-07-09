import axios from 'axios';
import dotenv from 'dotenv';
import { Movie } from "../models/Movie.js";

dotenv.config();
const OMDB_API_KEY = process.env.OMDB_API_KEY;


const isStale = (date) => {
  const now = new Date();
  const diff = (now - date) / (1000 * 60 * 60); // hours
  return diff > 24;
};


const transformMovieData = (data) => ({
  omdbId: data.imdbID,
  title: data.Title,
  year: parseInt(data.Year),
  genre: data.Genre?.split(',').map(g => g.trim()),
  director: data.Director,
  actors: data.Actors?.split(',').map(a => a.trim()),
  rating: parseFloat(data.imdbRating),
  runtime: parseInt(data.Runtime) || 0,
  poster: data.Poster,
  fetchedAt: new Date()
});

// Controller to search movies
export const searchMovies = async (req, res) => {
  const { search } = req.query;

  if (!search) return res.status(400).json({ msg: "Search query is required" });

  try {
    const apiUrl = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${search}`;

    // Fetch search results from OMDb (basic list with IDs)
    const searchResponse = await axios.get(apiUrl);
    const searchResults = searchResponse.data.Search || [];

    const fullResults = [];

    for (const result of searchResults) {
      const existing = await Movie.findOne({ omdbId: result.imdbID });

      if (existing && !isStale(existing.fetchedAt)) {
        fullResults.push(existing); 
      } else {
        
        const detailRes = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${result.imdbID}`);
        const transformed = transformMovieData(detailRes.data);

     
        await Movie.findOneAndUpdate(
          { omdbId: transformed.omdbId },
          transformed,
          { upsert: true, new: true }
        );

        fullResults.push(transformed);
      }
    }

    res.json(fullResults);
  } catch (err) {
    console.error("OMDb error:", err);
    res.status(500).json({ msg: "Error fetching movies", error: err.message });
  }
};


export const getMovieById = async (req, res) => {
  const omdbId = req.params.id;

  try {
   
    let movie = await Movie.findOne({ omdbId });

    // 2. If not found or stale, fetch from OMDb
    if (!movie || isStale(movie.fetchedAt)) {
      const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${omdbId}`;
      const response = await axios.get(url);

      if (response.data.Response === "False") {
        return res.status(404).json({ msg: "Movie not found" });
      }

      const transformed = transformMovieData(response.data);

      // Upsert into DB
      movie = await Movie.findOneAndUpdate(
        { omdbId },
        transformed,
        { upsert: true, new: true }
      );
    }

    res.json(movie);
  } catch (err) {
    console.error("Get movie by ID error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

