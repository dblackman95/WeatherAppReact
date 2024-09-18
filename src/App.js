import React, { useState, useEffect, useRef, createContext, useCallback } from 'react';
import axios from 'axios';


import SelectCity from './components/SelectCity';

export const CityContext = createContext();

function App() {

  const url_weather1 = 'https://api.openweathermap.org/data/2.5/weather?lat=';
  const url_weather2 = '&lon=';
  const url_weather3 = '&appid=b6d014499a7c240caa76776d1b27da83';

  const url_geocode1 = 'http://api.openweathermap.org/geo/1.0/direct?q=';
  const url_geocode2 = '&limit=5&appid=b6d014499a7c240caa76776d1b27da83';

  const [ cityData, setCityData ] = useState([]);

  const [ weatherData, setWeatherData ] = useState(null);
  const [ currentWeather, setCurrentWeather ] = useState("");

  const [ showMultipleCityModal, setShowMultipleCityModal ] = useState(false);
  const [ hasRun, setHasRun ] = useState(false);

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      handleCitySearch();
    }
  }

  function fetchCityInfo(city) {
    setCityData([]);
    city = city.trim();
    let lat_lon_url = url_geocode1 + city + url_geocode2;

    fetch(lat_lon_url)
      .then(response => response.json())
      .then(json => {
        json.forEach((element, index) => {
          let city = {
            city_name: element.name,
            state: element.state,
            country: element.country,
            latitude: element.lat,
            longitude: element.lon,
          }
          if (index > 1) {
            setShowMultipleCityModal(true);
          }
          setCityData(prevCityData => [...prevCityData, city]);
        });
      });
    setHasRun(true);
  };

  useEffect(() => {
    console.log(showMultipleCityModal);
    console.log(hasRun);
    if (!showMultipleCityModal && hasRun) {
      if (cityData) {
        if (cityData.length > 0) {
          console.log(cityData);
          fetchWeatherInfo();
        }
      }
    }
  }, [hasRun, showMultipleCityModal, cityData]);

  function handleCitySearch() {
    let city = document.getElementById("citysearch").value;
    if (cityData) {
      if (cityData.length > 0) {
        setCityData([]);
        setHasRun(false);
      }
    }
    fetchCityInfo(city);
  }

  const fetchWeatherInfo = function() {

    let lat = cityData[0].latitude;
    let lon = cityData[0].longitude;

    let weather_url = url_weather1 + lat + url_weather2 + lon + url_weather3;

    fetch(weather_url)
      .then(response => response.json())
      .then(json => {
          let weather = {
            clouds: json.clouds,
            coords: json.coord,
            main: json.main,
            name: json.name,
            sys: json.sys,
            date_time: json.dt,
            timezone: json.timezone,
            visibility: json.visibility,
            weather: json.weather,
            wind: json.wind,
          }
          setWeatherData(weather);
          setCurrentWeather(weather.weather[0].main);
      });

  };

  function convertKelvinToFahrenheit(kelvin_string) {
    let kelvin = parseFloat(kelvin_string);
    return Math.round(((kelvin - 273.15) * 1.8) + 32);
  }

  function convertKelvinToCelsius(kelvin_string) {
    let kelvin = parseFloat(kelvin_string);
    return Math.round(kelvin - 273.15);
  }

  function convertMPStoMPH(mps_string) {
    let mps = parseFloat(mps_string);
    return (mps * 2.237).toFixed(2);
  }

  function getTimeZoneTime(time_utc, time_shift) {
    let time = parseInt(time_utc);
    let shift = parseInt(time_shift);
    console.log(time_shift);
    return time + shift + 14400;
  }

  function getHourOfDay(unix_time) {
    const date = new Date(unix_time * 1000);
    return date.getHours();
  }

  function getTime(time_utc, time_shift) {
    const time = getTimeZoneTime(time_utc, time_shift);
    return getHourOfDay(time);
  }

  useEffect(() => {

    const DAYSKY = "#0062E4";
    const GRAYSKY = "#a5b7bd";
    const NIGHTSKY = "#121b3a";

    const element = document.getElementById('root');
    // Todo -- add functionality for adding class based on weather
    if (currentWeather !== "") {
      element.classList.remove(...element.classList);
      let hour = 0;
      if (weatherData) {
        console.log(weatherData);
        let time = weatherData.date_time;
        let time_shift = weatherData.timezone;
        // Todo -- add functionality for determining morning, afternoon, night, etc.
        hour = getTime(time, time_shift);
      }

      console.log("Hour is " + hour);

      if (currentWeather.toUpperCase().indexOf("CLOUD") !== -1) {
        element.classList.add('cloud');
        if (hour < 6) {
          element.style.backgroundColor = NIGHTSKY;
          element.classList.add('night');
        } else if (hour < 18) {
          element.style.backgroundColor = GRAYSKY;
          element.classList.add('day');
        } else {
          element.style.backgroundColor = NIGHTSKY;
          element.classList.add('night');
        }
      } else if (currentWeather.toUpperCase().indexOf("RAIN") !== -1) {
        element.classList.add('rain');
        if (hour < 6) {
          element.style.backgroundColor = NIGHTSKY;
        } else if (hour < 18) {
          element.style.backgroundColor = GRAYSKY;
          element.classList.add('day');
        } else {
          element.style.backgroundColor = NIGHTSKY;
        }
      } else if (currentWeather.toUpperCase().indexOf("MIST") !== -1) {
        element.classList.add('mist');
        if (hour < 6) {
          element.style.backgroundColor = NIGHTSKY;
          element.classList.add('night');
        } else if (hour < 18) {
          element.style.backgroundColor = GRAYSKY;
          element.classList.add('day');
        } else {
          element.style.backgroundColor = NIGHTSKY;
          element.classList.add('night');
        }
      } else if (currentWeather.toUpperCase().indexOf("DRIZZLE") !== -1) {
        element.classList.add('mist');
        if (hour < 6) {
          element.style.backgroundColor = NIGHTSKY;
          element.classList.add('night');
        } else if (hour < 18) {
          element.style.backgroundColor = GRAYSKY;
          element.classList.add('day');
        } else {
          element.style.backgroundColor = NIGHTSKY;
          element.classList.add('night');
        }
      } else if (currentWeather.toUpperCase().indexOf("SNOW") !== -1) {
        element.classList.add('snow');
        element.classList.add('snow2');
        element.classList.add('snow3');
        if (hour < 6) {
          element.style.backgroundColor = NIGHTSKY;
        } else if (hour < 18) {
          element.style.backgroundColor = GRAYSKY;
          element.classList.add('day');
        } else {
          element.style.backgroundColor = NIGHTSKY;
        }
      } else if (currentWeather.toUpperCase().indexOf("THUNDER") !== -1) {
        element.classList.add('storm');
        if (hour < 6) {
          element.style.backgroundColor = NIGHTSKY;
        } else if (hour < 18) {
          element.style.backgroundColor = GRAYSKY;
          element.classList.add('day');
        } else {
          element.style.backgroundColor = NIGHTSKY;
        }
      } else if (currentWeather.toUpperCase().indexOf("CLEAR") !== -1) {
        element.classList.add('clear');
        if (hour < 6) {
          element.style.backgroundColor = NIGHTSKY;
          element.classList.add('night');
        } else if (hour < 18) {
          element.style.backgroundColor = DAYSKY;
          element.classList.add('day');
        } else {
          element.style.backgroundColor = NIGHTSKY;
          element.classList.add('night');
        }
      }
    }
  }, [setCurrentWeather, currentWeather, setWeatherData, weatherData]);

  return (
    <div className="App">
      <div className="container">
        <div className="top">
          <div className="search">
             <input type="text" placeholder="Search for city..." id="citysearch" onKeyUp={searchLocation} className="citysearch" />
          </div>
          <div className="location">
            {cityData && cityData.length > 0 &&
            <>
              <p><h2>{cityData[0].city_name}</h2>{cityData[0].state}, {cityData[0].country}</p>
            </>
            } 
          </div>
          <div className="temp">
            {weatherData &&
            <h1>{convertKelvinToFahrenheit(weatherData.main.temp)}°F ({convertKelvinToCelsius(weatherData.main.temp)}°C)</h1>
            }
          </div>
          <div className="description">
            {weatherData &&
            <>
              <p>{weatherData.weather[0].main}</p>
              <p>{weatherData.weather[0].description}</p>
            </>
            }
          </div>
        </div>
        <div className="bottom">
          <div className="feels">
            {weatherData &&
              <p>Feels like {convertKelvinToFahrenheit(weatherData.main.feels_like)}°F ({convertKelvinToCelsius(weatherData.main.feels_like)}°C)</p>
            }
          </div>
          <div className="humidity">
            {weatherData &&
              <p>{weatherData.main.humidity}% Humidity</p>
            }
          </div>
          <div className="wind">
            {weatherData &&
              <>
                <p>Wind {convertMPStoMPH(weatherData.wind.speed)} MPH</p>
                <p>Wind Direction {weatherData.wind.deg} degrees</p>
                {weatherData.wind.gust &&
                <p>Gusts {convertMPStoMPH(weatherData.wind.gust)}</p>
                }
              </>
            }
          </div>
          {showMultipleCityModal &&
          <CityContext.Provider value={[ cityData, setCityData, setShowMultipleCityModal ]}>
            <SelectCity fetchWeatherInfo={fetchWeatherInfo} />
          </CityContext.Provider> 
          }
        </div>
      </div>
    </div>
  );
}

export default App;
