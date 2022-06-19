import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { HttpHeaders } from '@angular/common/http'

import { catchError, map } from 'rxjs/operators'

import { HttpErrorHandler, HandleError } from './http-error-handler.service'

interface CountryListApiResponse {
  response: string[]
  results: number
}

interface CountryStatsResponse {
  response: CountryStats[]
  results: number
}

export interface CountryStats {
  cases: {
    "1M_pop": string
    active: number
    critical: number
    new: string
    recovered: string
    total: number
  }
  continent: string
  country: string
  day: string
  deaths: {
    "1M_pop": string
    new: string
    total: number
  }
  population: number
  tests: {
    "1M_pop": string
    total: number
  }
  time: string
}

@Injectable()
export class CovidService {
  baseUrl = 'https://covid-193.p.rapidapi.com'
  private handleError: HandleError
  private headers = new HttpHeaders({
    "x-rapidapi-host": "covid-193.p.rapidapi.com",
    "x-rapidapi-key": "YEhEI0buefmshe8h027JqEr2urFop1VSiwXjsnsRY6kImgNESF",
  })
  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('CovidService')
  }

  getCountries() {
    return this.http.get<CountryListApiResponse>(`${this.baseUrl}/countries`, {headers: this.headers})
      .pipe(
        map( ( data ) => {
          return data.response
        }),
        catchError(this.handleError('getCountries', [])),
      )
  }

  getCurrentCountryStats(country?: string) {
    let params: { [param: string]: string | number | boolean } = {}

    if( country ) {
      params["country"] = country
    }

    return this.http.get<CountryStatsResponse>(`${this.baseUrl}/statistics`, {headers: this.headers, params })
      .pipe(
        map( ( data ) => {
          return data.response
        }),
        catchError(this.handleError('getCurrentCountryStats', []))
      )
  }
}