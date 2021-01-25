import { Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  entries = [];
  units = this.weatherService.getUnits();
  windspeed = 'mp/s';

  sliderConfig = {
    freeMode: true,
    SpaceBetween: 5,
    slidesPerView: 3.3
  }

  constructor(
    private geolocation: Geolocation, 
    private platform: Platform,
    private weatherService: WeatherService) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then(position => {
        console.log("position:", position);
        this.entries.push({type: 'geo', val: position.coords, class: 'cold'});

        this.getWeather(0).subscribe(res => {
          this.entries[0].weather = res;
          console.log('Weather:', res )
        });

        this.getForecast(0).subscribe(res => {
          this.entries[0].forecast = res;
          console.log('Forecast:', res );
          this.calculateNextDays(0);
        });

      })
    })
  }

  getWeather(index) {
    let info = this.entries[index];
    return this.weatherService.getCurrentWeather(info);
  }

  getForecast(index) {
    let info = this.entries[index];
    return this.weatherService.getForecast(info);
  }

  getWeatherIcon(icon){
    return this.weatherService.getWeatherIcon(icon);
  }

  changeUnits(){
    this.units = this.weatherService.changeUnits();
    this.getWeather(0).subscribe(res => {
      this.entries[0].weather = res;
    })

    this.getForecast(0).subscribe(res => {
      this.entries[0].forecast = res;
    })
    
  }

  getUnitString(){
    return this.units === 'metric' ? 'Celsius' : 'Farenheit';
  }

  getWindSpeed(){
    return this.units === 'metric' ? 'mp/s' : 'km/h';
  }

  calculateNextDays(index){
    let d = new Date();
    d.setHours(23,59,59,59);
    let time = d.getTime() / 1000;

    this.entries[index].nextDays = [];

    let dayMin = null;
    let dayMax = null;

    for (let item of this.entries[index].forecast.list){
      if(item.dt <= time){
        if(!dayMin || item.main.temp_min < dayMin){
          dayMin = item.main.temp_min;
        }
        if(!dayMax || item.main.temp_max > dayMax){
          dayMax = item.main.temp_max;
        }
      } else {
        this.entries[index].nextDays.push({date: time*1000, min: dayMin.toFixed(), max: dayMax.toFixed()});

        dayMin = item.main.temp_min;
        dayMax = item.main.temp_max;

        d.setDate(d.getDate() + 1);
        d.setHours(23, 59, 59, 59);
        time = d.getTime() / 1000;
      }
    }
    console.log(this.entries[index].nextDays)
  }
}
