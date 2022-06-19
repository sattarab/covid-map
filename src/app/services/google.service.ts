import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { catchError, map } from 'rxjs/operators'

import { HttpErrorHandler, HandleError } from './http-error-handler.service'

interface GoogleCoordinateResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number
        lng: number
      }
    }
  }>
}

@Injectable()
export class GoogleService {
  key = "AIzaSyA0k1I-uTIyKddELXM0CTxOS0ZKH1WMKv0"
  baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json'

  private handleError: HandleError
  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('GoogleService')
  }

  getCoordinatesForCountry(address: string) {
    return this.http.get<GoogleCoordinateResponse>(this.baseUrl, { params: { address, key: this.key}})
      .pipe(
        map( ( data ) => {
          return data.results?.[ 0 ]?.geometry?.location
        } ),
        catchError(this.handleError('getCoordinatesForCountry', {lat: 0, lng: 0})),
      )
  }
}