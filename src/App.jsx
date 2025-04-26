import { useState, useEffect } from 'react';
import React from "react";
import ReactDOM from "react-dom";
import { Thermometer,NavigationArrow,Windmill,Drop,GlobeHemisphereEast,HouseLine} from "@phosphor-icons/react";
import './App.css';

const api_key = "b65707795cc0c0c89539279426e5f01d";

function App() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState();
  const [value, setValue] = useState("");
  const [isloading, setIsloading] = useState(false)
  const sentences = [
    "Stay hydrated in hot weather! ",
    "Carry an umbrella if it looks cloudy ",
    "Windy today? Hold onto your hat!",
    "Humidity can make temperatures feel warmer ",
    "Check the UV index before going out ",
    "Snow expected? Bundle up and drive safe! ",
  ];
  
  const [currentSentence, setCurrentSentence] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentence((prev) => (prev + 1) % sentences.length);
    }, 4000); // changes every 4 seconds
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    async function getWeatherApp() {
      try {
        setIsloading(true)
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
        const res = await fetch(url);
        const data = await res.json();
        console.log(data)
        setWeatherData(data);
      }
      catch (err) {
        console.error("Failed to fetch weather:", err);
      }
      finally {
        setIsloading(false);
      }
    }
    if (city.trim())
      getWeatherApp();
  }, [city]);

  const { main, wind } = weatherData || {};

  return (
    <div className='flex items-center justify-start  flex-col gap-[5vh] min-h-screen bg-gradient-to-tr from-blue-300 via-purple-300 to-indigo-300 p-6'>
      <div className='flex gap-[3vh] items-center justify-center m-[5vh] h-[8vh]' >

      <h1 className='relative top-[2vh] -left-[5vh]'><GlobeHemisphereEast size={42} /></h1>
      <div className="mt-6 text-center text-lg sm:text-xl font-medium text-black animate-fade-in-out transition-opacity duration-500">
  {sentences[currentSentence]}
</div>
      </div>
      <div className='flex gap-[5vh]'>
        <input
          className='border border-black rounded-lg px-4 py-2 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Enter City Name:"
        />
        <button
          onClick={() => setCity(value)}
          className='bg-black text-white px-6 py-2 rounded-lg shadow-lg hover:bg-gray-800 transition-all'
        >
          Search
        </button>
      </div>

      {isloading && (
        <video autoPlay loop muted className="w-[9vh] h-[8vh]">
          <source src="animation.webm" type="video/webm" />
        </video>
      )}

      {weatherData?.cod == 404 && <p className='text-red-600 font-semibold'>City not found</p>}

      {!isloading && weatherData && weatherData.cod < 400 && (
       <div className='w-[90vw] sm:w-[60vh] bg-black text-white flex flex-col items-center gap-4 p-6 rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-md transition-transform duration-500 hover:scale-105 border border-gray-700'>
       <img
         src={`https://openweathermap.org/img/wn/${weatherData?.weather?.[0]?.icon}@4x.png`}
         alt={weatherData?.weather?.[0]?.description || "Weather Icon"}
         className="w-32 h-32 animate-bounce"
       />
       
       <div className="text-3xl font-bold tracking-widest text-blue-400 drop-shadow-md">
         {weatherData?.weather?.[0]?.main}
       </div>
       
       <div className="text-xl flex items-center gap-2">
         {/* <Thermometer size={28} className="text-yellow-300" /> */}
         Temp: {(main?.temp - 273.15).toFixed(2)} °C
       </div>
       
       <div className='text-xl font-semibold flex items-center gap-2'>
       <HouseLine size={32} />
         {city.toUpperCase()}
       </div>
       
       <div className='flex justify-around w-full text-md mt-4 gap-4'>
         <div className='flex items-center gap-1'>
           <Windmill size={26} className="text-blue-300" />
           Wind: {wind?.speed} m/s
         </div>
         <div className='flex items-center gap-1'>
           <Drop size={26} className="text-blue-400" />
           Humidity: {main?.humidity}%
         </div>
       </div>
     </div>
     
      )}
    </div>
  );
}

export default App;
