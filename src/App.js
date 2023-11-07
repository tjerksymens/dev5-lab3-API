export default class App{
    constructor(){
        this.getLocation();
    }

    getLocation(){
        navigator.geolocation.getCurrentPosition(
            this.showPosition.bind(this), 
            this.errorPosition
        );
    }

    showPosition(position){
        console.log(position);
        let x = position.coords.latitude;
        let y = position.coords.longitude;
        let cachedWeatherData = this.getCachedWeatherData();

        if(cachedWeatherData && this.isCacheValid(cachedWeatherData.timestamp)){
            this.displayWeather(cachedWeatherData.weather);
            console.log("Cached weather data used");
            this.getCSSkins(cachedWeatherData.weather.app_temp);
        } else {
            this.getWeather(x, y)
            console.log("New weather data fetched");
        }
    }

    getWeather(x, y){
        //url: https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=0ed3744e6c9b4f6abe8216b6abe3fe96
        //fetch, then log result
        fetch(`https://api.weatherbit.io/v2.0/current?lat=${x}&lon=${y}&key=0ed3744e6c9b4f6abe8216b6abe3fe96`)
            .then(response => response.json())
            .then(data => {
                let weather = data.data[0];
                this.saveWeatherDataToCache(weather);
                this.displayWeather(weather);
                this.getCSSkins(weather.app_temp);
            })
            .catch(error => console.log(error));
    }

    getCSSkins(temp){
        console.log("getSkins");
        fetch(`https://bymykel.github.io/CSGO-API/api/en/skins.json`)
            .then(response => response.json())
            .then(data => {
                let skins = data;
                this.displayCSSkins(skins, temp);
                console.log(skins);
            })
            .catch(error => console.log(error));
    }

    saveWeatherDataToCache(weather){
        const timestamp = Date.now();
        const weatherData = {
            timestamp: timestamp,
            weather: weather
        };
        localStorage.setItem('weatherData', JSON.stringify(weatherData));
    }

    getCachedWeatherData(){
        const cachedData = localStorage.getItem('weatherData');
        return cachedData ? JSON.parse(cachedData) : null;
    }

    isCacheValid(timestamp){
        const currentTime = Date.now();
        const cachedDuration = 60 * 60 * 1000; // 1 hour
        return (currentTime - timestamp < cachedDuration);
    }

    displayWeather(weather){
        document.querySelector("h2").innerHTML =  "It's currently " + weather.app_temp + "°C with " + weather.weather.description + " in " + weather.city_name;
    }

    displayCSSkins(skins, temp){
        if(temp > 30){
            document.querySelector("span").innerHTML = skins[1007].name;
            document.querySelector('img').src = skins[1007].image;
        } else if(temp < 30 && temp > 0){
            document.querySelector("span").innerHTML = skins[246].name;
            document.querySelector('img').src = skins[246].image;
        } else if(temp < 0){
            document.querySelector("span").innerHTML = skins[1707].name;
            document.querySelector('img').src = skins[1707].image;
        }
    }

    errorPosition(error){
        console.log(error);
    }
}