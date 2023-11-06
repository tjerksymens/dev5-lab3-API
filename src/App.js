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

    errorPosition(error){
        console.log(error);
    }
}