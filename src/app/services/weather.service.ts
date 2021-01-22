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
} 
