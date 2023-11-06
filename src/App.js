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
        this.getWeather(x, y);
    }

    getWeather(x, y){
        //url: https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=0ed3744e6c9b4f6abe8216b6abe3fe96
        //fetch, then log result
        fetch(`https://api.weatherbit.io/v2.0/current?lat=${x}&lon=${y}&key=0ed3744e6c9b4f6abe8216b6abe3fe96`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                let weather = data.data[0];
                console.log(weather);
            })
            .catch(error => console.log(error));
    }

    errorPosition(error){
        console.log(error);
    }
}