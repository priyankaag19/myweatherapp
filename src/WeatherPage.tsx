import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface WeatherData {
  temperature: number;
  weatherDescription: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

const WeatherPage: React.FC = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=807cf549e33fe3ff75fe86b4cc2a2d03&units=metric`);
        const data = response.data;
        setWeatherData({
          temperature: data.main.temp,
          weatherDescription: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          pressure: data.main.pressure,
        });

        const visitedCities = JSON.parse(localStorage.getItem('visitedCities') || '[]');
        if (!visitedCities.includes(cityName)) {
          visitedCities.push(cityName);
          localStorage.setItem('visitedCities', JSON.stringify(visitedCities));
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, [cityName]);

  const getWeatherEmoji = (weatherDescription: string) => {
    const descriptionLowerCase = weatherDescription.toLowerCase();
    if (descriptionLowerCase.includes('clear')) {
      return '☀️';
    } else if (descriptionLowerCase.includes('cloud')) {
      return '☁️';
    } else if (descriptionLowerCase.includes('rain')) {
      return '🌧️';
    } else if (descriptionLowerCase.includes('thunderstorm')) {
      return '⛈️';
    } else if (descriptionLowerCase.includes('snow')) {
      return '❄️';
    } else {
      return '';
    }
  };

  const getBackgroundColor = (weatherDescription: string) => {
    const descriptionLowerCase = weatherDescription.toLowerCase();
    if (descriptionLowerCase.includes('clear')) {
      return 'bg-blue-200';
    } else if (descriptionLowerCase.includes('cloud')) {
      return 'bg-gray-300';
    } else if (descriptionLowerCase.includes('rain')) {
      return 'bg-green-200';
    } else if (descriptionLowerCase.includes('thunderstorm')) {
      return 'bg-yellow-200';
    } else if (descriptionLowerCase.includes('snow')) {
      return 'bg-white';
    } else {
      return 'bg-gray-100';
    }
  };

  if (!weatherData) return <div className="text-center mt-8">Loading...</div>;

  return (
    <div className={`container mx-auto mt-8 ${getBackgroundColor(weatherData.weatherDescription)}`}>
      <h2 className="text-2xl font-bold mb-4">Weather for City {cityName}</h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border">
          <tbody>
            <tr className="border-b">
              <td className="border px-4 py-2">Temperature</td>
              <td className="border px-4 py-2">{weatherData.temperature}°C</td>
            </tr>
            <tr className="border-b">
              <td className="border px-4 py-2">Description</td>
              <td className="border px-4 py-2">{weatherData.weatherDescription} {getWeatherEmoji(weatherData.weatherDescription)}</td>
            </tr>
            <tr className="border-b">
              <td className="border px-4 py-2">Humidity</td>
              <td className="border px-4 py-2">{weatherData.humidity}%</td>
            </tr>
            <tr className="border-b">
              <td className="border px-4 py-2">Wind Speed</td>
              <td className="border px-4 py-2">{weatherData.windSpeed} m/s</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Pressure</td>
              <td className="border px-4 py-2">{weatherData.pressure} hPa</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default WeatherPage;