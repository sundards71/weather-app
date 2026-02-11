import { useEffect, useState } from 'react'
import './App.css'
import PropTypes from 'prop-types';

// Images
import SearchIcon from './assets/search2.png'
import ClearIcon from './assets/clear.png'
import DrizzleIcon from './assets/drizzle.png'
import CloudIcon from './assets/cloud.png'
import RainIcon from './assets/rain.png'
import SnowIcon from './assets/snow.png'
import HumidityIcon from './assets/humidity.png'
import WindIcon from './assets/wind.png'

const WeatherDetails = ({icon, temp, city, country, lat, log, humidity, wind}) => {
  return(
  <>
    <div className='image'>
      <img src={icon} alt="Image" />
    </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className="lat">latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="log">longitude</span>
          <span>{log}</span>
        </div>
      </div>
        <div className="data-container">
          <div className="element">
            <img src={HumidityIcon} alt='Humidity' className='icon' width={50}></img>
            <div className="data">
              <div className="humidity-percent">{humidity}%</div>
              <div className="text">Humidity</div>
            </div>
          </div>
          <div className="element">
            <img src={WindIcon} alt='wind' className='icon' width={50}></img>
            <div className="data">
              <div className="wind-percent">{wind} km/h</div>
              <div className="text">Wind Speed</div>
            </div>
          </div>
        </div>
  </>
  )
} 

WeatherDetails.    propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired
}

function App() {
  let api_key= `3524059b0c719364cf3da02d5393e080`
  const[text, setText] = useState("London")

  const [icon, setIcon] = useState(ClearIcon)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [lat, setLag] = useState(0)
  const [log, setLog] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [wind, setWind] = useState(0)

  const [cityNotFound, setCityNotFound] = useState(false) 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const weatherIconMap = {
    "01d": ClearIcon,
    "01n": ClearIcon,
    "02d": CloudIcon,
    "02n": CloudIcon,
    "03d": DrizzleIcon,
    "03n": DrizzleIcon,
    "04d": DrizzleIcon,
    "04n": DrizzleIcon,
    "09d": RainIcon,
    "09n": RainIcon,
    "10d": RainIcon,
    "10n": RainIcon,
    "13d": SnowIcon,
    "13n": SnowIcon,
  };

  const search = async () =>{
    setLoading(true)
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`

    try {
      let res = await fetch(url)
      let data = await res.json()
      // console.log(data)
      if (data.cod === "404"){
        console.error("City not found")
        setCityNotFound(true)
        setLoading(false)
        return
      }
      
    setHumidity(data.main.humidity)
    setWind(data.wind.speed)
    setTemp(Math.floor(data.main.temp))
    setCity(data.name)
    setCountry(data.sys.country)
    setLag(data.coord.lat)
    setLog(data.coord.lon)
    
    const weatherIconCode = data.weather[0].icon
    setIcon(weatherIconMap[weatherIconCode] || ClearIcon)
    setCityNotFound(false)


    } catch (error) {
      console.error("An error occurred:", error.message)
      setError("An error occurred while fetching weather data.")
    } finally{
      setLoading(false)
    }
  }
  
  const handleCity = (e) => {
     setText(e.target.value)
  };
  const handlekeyDown = (e) => {
    if(e.key === "Enter"){
      search();
    }
  }

  useEffect(function(){
    search();
    }, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='Cityname' placeholder='Search City'onChange={handleCity} value={text} onKeyDown={handlekeyDown}/>
          <div className='search-icon'><img src={SearchIcon} alt="Search" onClick={() => search() } /></div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}

        {!loading && !cityNotFound && !error && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}

        <p className="copyright">Designed by <span>Sundar Ds</span></p>
      </div>
    </>
  )
}

export default App
