const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY ='147eb3d9e6377c3c175cec24c8731b9f';
// 49cc8c821cd2aff9af04c9f98c36eb74

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10? '0'+hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10? '0'+minutes: minutes)+ ' ' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

function showWeatherData (data){
    console.log(data);
    let {name, sunrise, sunset, population} = data.city;
    let {pressure, sea_level} = data.list[0].main;

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Population</div>
        <div>${population.toLocaleString('en-US')}</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure} hPa</div>
    </div>
    <div class="weather-item">
        <div>Sea-level</div>
        <div>${sea_level} mbar</div>
    </div>

    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset*1000).format('HH:mm a')}</div>
    </div>  
    `;
    
    let otherDayForcast = ''
    data.list.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">Temp - ${day.main.temp_min}&#176;C</div>
                <div class="temp">Feels like - ${day.main.feels_like}&#176;C</div>
            </div>
            
            `
        }else if(idx % 8 == 0){
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Temp - ${day.main.temp_min}&#176;C</div>
                <div class="temp">Feels like - ${day.main.feels_like}&#176;C</div>
            </div>
            
            `
        }
    })
    weatherForecastEl.innerHTML = otherDayForcast;
    
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText =
      "Population: " + population;
    document.querySelector(".wind").innerText =
      "Sea-level: " + sea_level;
    document.querySelector(".weather").classList.remove("loading");
    document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x900/?" + name + "')";
}

function getWeatherData ( city ) {
    fetch( 
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=metric&appid=" +
        API_KEY
    )
    .then(res => res.json())
        .then(data => {
            showWeatherData(data);
        })
}

getWeatherData("Kharagpur")

let weather = {
    apiKey: "147eb3d9e6377c3c175cec24c8731b9f",
    fetchWeather: function (city) {
        fetch(
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
        .then((response) => {
            if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data.city;
        const { icon, description } = data.list[0].weather[0];
        const { temp, humidity } = data.list[0].main;
        const { speed } = data.list[0].wind;

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText =
        "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
        "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".search button").addEventListener("click", function () {
    getWeatherData(document.querySelector(".search-bar").value);
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        getWeatherData(document.querySelector(".search-bar").value);
        weather.search();
    }
});

weather.fetchWeather("Kharagpur");
