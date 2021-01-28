import { AlertController, Platform, IonSlides  } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { WeatherService } from 'src/app/services/weather.service';

const CITIES_KEY = 'cities';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  @ViewChild('slides') slides: IonSlides;
  entries: any = [];
  units = this.weatherService.getUnits();
  windspeed = 'mp/s';

  date = new Date();
  dateHours = this.date.getHours();

  background = null;
  bp = null;

  sliderConfig = {
    freeMode: true,
    SpaceBetween: 5,
    slidesPerView: 3.3
  }

  constructor(
    private geolocation: Geolocation, 
    private platform: Platform,
    private weatherService: WeatherService,
    private alertCtrl: AlertController) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.geolocation.getCurrentPosition().then(position => {
        console.log("position:", position);
        this.entries.push({type: 'geo', val: position.coords, class: 'cold'});
        this.loadCities();

        this.getWeather(0).subscribe(res => {
          this.entries[0].weather = res;
          console.log('Weather:', res );
          console.log('HOURS:', this.dateHours)
          if (this.dateHours >= 8 && this.dateHours < 12){
            this.background = 'url(/assets/MORNING.jpg)';
            this.bp = 'cover';
          } 
          else if (this.dateHours >= 20 || this.dateHours < 8){
            this.background = 'url(/assets/NIGHT.jpg)';
            this.bp = 'cover';
          }
          else {
            this.background = 'url(/assets/DAY.jpg)';
            this.bp = 'cover';
          }
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

  changeUnits(index){
    this.units = this.weatherService.changeUnits(index);
    this.getWeather(index).subscribe(res => {
      this.entries[index].weather = res;
    })

    this.getForecast(index).subscribe(res => {
      this.entries[index].forecast = res;
      this.calculateNextDays(index);
    })
    
  }

  getUnitString(){
    return this.units === 'metric' ? '°C' : '°F';
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
  doRefresh(e){
    setTimeout(() => {  this.getWeather(0).subscribe(res => {
      this.entries[0].weather = res;
    })

    this.getForecast(0).subscribe(res => {
      this.entries[0].forecast = res;
      this.calculateNextDays(0);
    });
      e.target.complete();
    }, 1000)
  }

  async addCity(){
    let alert = await this.alertCtrl.create({
      header: 'Add City',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Vancouver'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add City',
          handler: (data) => {
            let city = {type: 'city', val: data.name, nextDays: [], id: new Date().getTime(), clas: 'cold' };
            this.entries.push(city);
            setTimeout(() => {
              this.slides.slideTo(this.entries.length, 200);
            }, 300)
          }
        }
      ]
    });
    alert.present();
  }
  cityChanged(){
    this.slides.getActiveIndex().then( index => {
      this.getWeather(index).subscribe(res => {
        this.entries[index].weather = res;
      })
  
      this.getForecast(index).subscribe(res => {
        this.entries[index].forecast = res;
        this.calculateNextDays(index);
      });
    })
  }

  storeCity(){

  }

  loadCities(){

  }

  removeCity(index){
    console.log("Deleting city#", index)
  }
}
