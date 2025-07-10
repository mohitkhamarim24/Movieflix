import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff6b6b", "#00c49f", "#ffb347", "#6a5acd", "#ffa07a"];
 const apiBase = import.meta.env.VITE_BACKEND_URL;
const Analytics = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/movies/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error("Analytics fetch failed", err);
      }
    };

    fetchStats();
  }, []);

  if (!data) return <p className="text-center mt-10">Loading analytics...</p>;

  // ✅ Use correct field names as returned from backend
  const {
    genreCount = [],
    averageRatingsByGenre = [],
    runtimeByYear = [],
  } = data;

  // ✅ Transform for Recharts
  const genrePie = genreCount.map(({ genre, count }) => ({ name: genre, value: count }));
  const ratingBar = averageRatingsByGenre.map(({ genre, rating }) => ({ genre, rating }));
  const runtimeLine = runtimeByYear.map(({ year, avgRuntime }) => ({ year, runtime: avgRuntime }));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">📊 Movie Analytics Dashboard</h1>

      {/* Genre Distribution */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">🎬 Genre Distribution</h2>
        <PieChart width={400} height={300}>
          <Pie
            data={genrePie}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {genrePie.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip />
        </PieChart>
      </div>

      {/* Ratings by Genre */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">⭐ Average Ratings by Genre</h2>
        <BarChart width={500} height={300} data={ratingBar}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="genre" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Bar dataKey="rating" fill="#00c49f" />
        </BarChart>
      </div>

      {/* Runtime by Year */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-2">⏱️ Average Runtime by Year</h2>
        <LineChart width={600} height={300} data={runtimeLine}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Line type="monotone" dataKey="runtime" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
};

export default Analytics;
