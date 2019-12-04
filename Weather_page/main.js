
$(document).ready(()=>{
    //var $ = (selector) => document.querySelectorAll(selector)

    $('.location-provided')[0].style.display = 'none';
    $('.location-enter')[0].style.display = 'none';

    function geoFail(){
        $('location-enter').show();
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
    } 
    else {
        geoFail();
    }

    function successLocation(locationData){
        console.log(locationData)
        let weather = getWeather(locationData.coords.latitude,locationData.coords.longitude)
    }

    function errorLocation(error){
        console.log(error)
    }

    function getWeather(lat, lon){
        
        $.getJSON("https://api.forecast.io/forecast/b59cb056ae86ddcff4531258c647bf0d/" + lat + "," + lon + "?callback=?",
        function(weatherData)  {
            console.log(weatherData)
            $('.location-provided')[0].style.display = 'flex';
            $('.location-enter')[0].style.display = 'none';

                // geocoder = new google.maps.Geocoder();
                // var latlng = new google.maps.LatLng(lat, lon);
                // geocoder.geocode({'latLng': latlng}, function(results, status) {
                //   if (status == google.maps.GeocoderStatus.OK) {
                //   console.log(results)
                //     if (results[1]) {

                //     //city data
                //     let city =(city.short_name + " " + city.long_name)
            
            
                //     } else {
                //       alert("No results found");
                //     }
                //   } else {
                //     alert("Geocoder failed due to: " + status);
                //   }
               // });
            // $('.city').innerHTML = `<h1>${city}</h1>`
            $('.temp-now')[0].innerHTML = Math.round(weatherData.currently.apparentTemperature*10)/10;
            let city = ''
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyCuugDMliUtuYZ1tT2PZbgB_LMvOYi0wFU"`)
            .then(reponse=>reponse.json())
            .then(cityData=>{
                debugger;
                city = cityData; 
            })
            .catch(error=> console.log('Location error:'+error))
        })
        .catch((error)=>console.log('Error in fetching weather info: '+error))
    }
})





