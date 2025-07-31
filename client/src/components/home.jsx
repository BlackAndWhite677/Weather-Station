import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Box,
  CircularProgress
} from "@mui/material";

const cities = [
  "New York", "London", "Paris", "Tokyo", "Sydney", "Mumbai", "Delhi", "Singapore", "Dubai", "Toronto"
];

const Home = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch favorite cities from backend
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const weatherData = res.data.map((data) => ({
        city: data.city,
        temp: data.temp,
        weather: data.weather,
        humidity: data.humidity,
        wind: data.wind,
        }));
        setFavoriteCities(weatherData);
      } catch (err) {
        console.error("Failed to fetch favorites", err);
      }
    };

    fetchFavorites();
  }, []);

  // ✅ Handle "Get Weather" button click
  const handleSearch = async () => {
    if (!selectedCity) return alert("Please select a city");

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/weather/current/${selectedCity}`);
      const data = res.data;

      setWeatherData({
        city: data.name,
        temp: data.main.temp,
        weather: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed,
      });
    } catch (err) {
      console.error("Weather fetch error:", err);
      alert("Failed to fetch weather. Try again later.");
    }
    setLoading(false);
  };

  const handleAddFavorite = async (cityData) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/favorites", {city:cityData.city}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavoriteCities((prev) => [...prev, cityData]);
    } catch (err) {
      console.error("Add favorite failed", err);
    }
  };

  const handleRemoveFavorite = async (cityName) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete("http://localhost:5000/api/weather/favorites", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { city: cityName },
      });

      setFavoriteCities((prev) => prev.filter((city) => city.city !== cityName));
    } catch (err) {
      console.error("Remove favorite failed", err);
    }
  };


  return (
    <Container maxWidth="sm" style={{ marginTop: "50px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        ☁️ Weather Dashboard
      </Typography>

      <Autocomplete
  options={cities}
  inputValue={searchInput}
  onInputChange={(event, newInputValue) => {
    setSearchInput(newInputValue);
  }}
  value={selectedCity}
  onChange={(event, newValue) => {
    setSelectedCity(newValue);
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Enter City"
      variant="outlined"
      fullWidth
      style={{ marginBottom: "20px" }}
    />
  )}
  style={{ marginBottom: "20px" }}
/>


      <Button variant="contained" color="primary" onClick={handleSearch}>
        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Get Weather"}
      </Button>

      {/* ✅ Show weather only after button click */}
      {weatherData && (
        <Box
          sx={{
            marginTop: "30px",
            backgroundColor: "#E0F7FA",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h5">Weather in {weatherData.city}</Typography>
          <Typography variant="body1">Temperature: {weatherData.temp}°C</Typography>
          <Typography variant="body1">Condition: {weatherData.weather}</Typography>
          <Typography variant="body1">Humidity: {weatherData.humidity}%</Typography>
          <Typography variant="body1">Wind Speed: {weatherData.wind} m/s</Typography>

          <Button
            variant="outlined"
            color="secondary"
            sx={{ marginTop: "10px" }}
            onClick={() => handleAddFavorite(weatherData)}
          >
            ➕ Add to Favorites
          </Button>
        </Box>
      )}

      {/* ✅ Show favorite cities from backend */}
      {favoriteCities.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <Typography variant="h5" gutterBottom>🌟 Favorite Cities</Typography>

          {favoriteCities.map((city, index) => {
            let icon = "☁️";
            if (city.weather.toLowerCase().includes("clear")) icon = "☀️";
            else if (city.weather.toLowerCase().includes("rain")) icon = "🌧️";

            return (
              <Box
                key={index}
                sx={{
                  backgroundColor: "#F1F8E9",
                  padding: "16px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  textAlign: "left",
                }}
              >
                <Typography variant="h6">{icon} {city.city}</Typography>
                <Typography variant="body2">Temperature: {city.temp}°C</Typography>
                <Typography variant="body2">Condition: {city.weather}</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  sx={{ marginTop: "8px" }}
                  onClick={() => handleRemoveFavorite(city.city)}
                >
                  ❌ Remove
                </Button>
              </Box>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default Home;
