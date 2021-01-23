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
        })
      })
    })
  }

  getWeather(index) {
    let info = this.entries[index];
    return this.weatherService.getCurrentWeather(info);
  }

  getWeatherIcon(icon){
    return this.weatherService.getWeatherIcon(icon);
  }

  changeUnits(){
    this.units = this.weatherService.changeUnits();
    this.getWeather(0).subscribe(res => {
      this.entries[0].weather = res;
      console.log('Weather:', res )
    })
  }

  getUnitString(){
    return this.units === 'metric' ? 'Celsius' : 'Farenheit';
  }

  getWindSpeed(){
    return this.units === 'metric' ? 'mp/s' : 'km/h';
  }
}
