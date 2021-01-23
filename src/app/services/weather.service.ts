import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '49e67dd4718643fbb7345c764ea14e8b';
  private units = 'metric';
  public baseURL = 'https://api.openweathermap.org/data/2.5/'

  constructor(private http: HttpClient) { }

  getCurrentWeather(info){
    if(info.type === 'geo') {
      return this.http.get(`${this.baseURL}weather?lat=${info.val.latitude}&lon=${info.val.longitude}&appid=${this.apiKey}&units=${this.units}`)
    } else {
      return this.http.get(`${this.baseURL}weather?q=${info.val}&appid=${this.apiKey}&units=${this.units}`)
    }
  } 

  getUnits(){
    return this.units;
  }

  changeUnits(){
    return this.units = this.units === 'metric' ? 'imperial' : 'metric';
  }

  getWeatherIcon(icon){
    // let result;
    // if (icon === '01d') result = `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX6tdaAV0BPDXGpZeFxno33EMM-eSN6wHkGg&usqp=CAU`
    // return result;
    return `http://openweathermap.org/img/wn/${icon}.png`
  }

} 
