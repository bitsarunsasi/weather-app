const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const today = new Date();
const dateInfo = {
    day: days[today.getDay()],
    date: today.getDate(),
    month: months[today.getMonth()],
    year: today.getFullYear(),
}
// Fetch Geolocation
function fetchGeoLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchWeatherInfo, handleError);
    }
    console.log('fdfgf')
}
// Error Handler
function handleError(error) {
    let errorStr;
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorStr = 'User denied the request for Geolocation.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorStr = 'Location information is unavailable.';
            break;
        case error.TIMEOUT:
            errorStr = 'The request to get user location timed out.';
            break;
        case error.UNKNOWN_ERROR:
            errorStr = 'An unknown error occurred.';
            break;
        default:
            errorStr = 'An unknown error occurred.';
    }
    console.error('Error occurred: ' + errorStr);
}

// Fetch Weather Data from API
const API_KEY = "48fb067176f998a675f3c63f525dd67b";

function fetchWeatherInfo(position) {
    // corodinate values
    const { latitude, longitude } = position.coords;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`

    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw response
        })
        .then((data) => {
            weatherInformation(data)
        })
        .catch((error) => {
            alert("Location " + error.statusText)
        })
}

// Weather Information
function weatherInformation(info) {

    const { feels_like, humidity, pressure, temp } = info.main;
    const { speed, deg } = info.wind;
    const { country } = info.sys;
    const { description, icon, id, main } = info.weather[0];

    // display data
    document.querySelector('.location-city').textContent = info.name;
    document.querySelector('.location-country').textContent = country;

    // unix time to local time
    //let currentDate = new Date(info.dt * 1000);
    let tempDate;
    if (dateInfo.date < 10) {
        tempDate = "0" + dateInfo.date;
    } else {
        tempDate = dateInfo.date;
    }
    document.querySelector('.date-info__day').textContent = dateInfo.day;
    document.querySelector('.date-info__date').textContent = tempDate;
    document.querySelector('.date-info__month').textContent = dateInfo.month;
    document.querySelector('.date-info__year').textContent = dateInfo.year;

    // weather data
    document.querySelector('.weather-icon img').src = `http://openweathermap.org/img/wn/${icon}@4x.png`;
    document.querySelector('.weather-data__temp .in-degree').textContent = Math.floor(temp);
    document.querySelector('.weather-data__desc').textContent = main;

    // weather additional  informations
    document.querySelector('.temp-feel span').textContent = Math.floor(feels_like);
    document.querySelector('.temp-humidity span').textContent = Math.floor(humidity);
    document.querySelector('.temp-pressure span').textContent = Math.floor(pressure);
    document.querySelector('.wind-speed span').textContent = Math.floor(speed * 3.6);



}


window.addEventListener('load', function () {
    //clockTimer();
    fetchGeoLocation();
});


let searchButton = document.querySelector('.cta-search');
let searchInputField = document.querySelector('.search-pannel__input');


function fetchsearchLocation(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    console.log(url)
    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw response
        })
        .then((data) => {
            weatherInformation(data)
        })
        .catch((error) => {
            alert("Location " + error.statusText)
        });

}

searchInputField.onkeydown = function (e) {
    let currentCity = searchInputField.value;
    if (e.keyCode == 13 && searchInputField.value != "") {
        fetchsearchLocation(currentCity)
    }
};

searchButton.addEventListener('click', function () {
    let currentCity = searchInputField.value;
    if (currentCity == '') {
        alert('Location field must contain value!!')
    } else {
        fetchsearchLocation(currentCity)
    }
})