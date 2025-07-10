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

const safeParseYear = (yearStr) => {
  const parsed = parseInt(yearStr);
  return isNaN(parsed) ? null : parsed;
};
const transformMovieData = (data) => ({
  omdbId: data.imdbID,
  title: data.Title,
 year: safeParseYear(data.Year),
  genre: data.Genre?.split(',').map(g => g.trim()),
  director: data.Director,
  actors: data.Actors?.split(',').map(a => a.trim()),
  rating:safeParseYear(data.imdbRating),
  runtime: safeParseYear(data.Runtime) || 0,
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

export const getMovieAnalytics = async (req, res) => {
  try {
    // 1. Genre Count (flatten genres array and group)
    const genreAggregation = await Movie.aggregate([
      { $unwind: "$genre" },
      { $group: { _id: "$genre", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 2. Average Rating of All Movies
    const avgRatingAggregation = await Movie.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" }
        }
      }
    ]);
    const avgRating = avgRatingAggregation[0]?.avgRating?.toFixed(2) || 0;

    // 3. Average Runtime Grouped by Year
    const runtimeByYear = await Movie.aggregate([
      {
        $group: {
          _id: "$year",
          avgRuntime: { $avg: "$runtime" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  // 4. Average Ratings by Genre
      const avgRatingsByGenre = await Movie.aggregate([
  { $unwind: "$genre" },
  {
    $group: {
      _id: "$genre",
      avgRating: { $avg: "$rating" }
    }
  },
  {
    $project: {
      genre: "$_id",
      rating: { $round: ["$avgRating", 2] },
      _id: 0
    }
  },
  { $sort: { rating: -1 } }
]);

    res.json({
      genreCount: genreAggregation.map(g => ({ genre: g._id, count: g.count })),
      averageRating: parseFloat(avgRating),
      runtimeByYear: runtimeByYear.map(y => ({
        year: y._id,
        avgRuntime: parseFloat(y.avgRuntime.toFixed(2)),
        movieCount: y.count
      }))
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

export const getMovies = async (req, res) => {
  try {
    const { search, filter } = req.query;

    const query = {};

    // Handle text search
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Handle genre filter
    if (filter) {
      const [key, value] = filter.split(":");
      if (key === "genre") {
        const genres = value.split(",");
        query.genre = { $in: genres };
      }
    }

    const movies = await Movie.find(query).limit(100);
    res.json(movies);
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

