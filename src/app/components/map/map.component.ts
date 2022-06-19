import { AfterViewInit, Component } from '@angular/core'
import * as L from "leaflet"
import { firstValueFrom } from 'rxjs'

import { CovidService, CountryStats, GoogleService } from '../../services'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  countries: string[] = []
  countryStatsMap: { [name: string]: CountryStats & { location: { lat: number, lng: number }}} = {}
  private map: L.Map | undefined

  constructor(private covidService: CovidService, private googleService: GoogleService) {}

  private initMap(): void {
    this.map = L.map('map', {
      maxZoom: 6,
      minZoom: 2,
      zoomControl: false,
    })

    L.control.zoom({
      position: 'topright',
    }).addTo(this.map)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      noWrap: true,
    }).addTo(this.map)

    this.map.setView([ 0, 0 ], 4)
  }

  private populateData() {
    this.covidService.getCountries()
      .subscribe(( countries ) => {
        this.countries = countries
        this.covidService.getCurrentCountryStats()
          .subscribe(async( countryStats ) => {
            var icon = L.icon({
              iconUrl: './assets/marker-icon.png',
              shadowUrl: '/assets/marker-shadow.png',
            })

            for( const countryStat of countryStats ) {
              if(this.countries.includes(countryStat.country)) {
                const location = await firstValueFrom(this.googleService.getCoordinatesForCountry(countryStat.country))
                this.countryStatsMap[countryStat.country] = {
                  ...countryStat,
                  location,
                }
                if(location) {
                  L.marker([location.lat, location.lng], { icon }).addTo(this.map!).bindPopup(`${ countryStat.country }<br>${ countryStat.cases.total} Confirmed Cases<br>${ countryStat.deaths.total } Deaths`)
                }
              }
            }
          })
      })
  }

  ngAfterViewInit(): void {
    this.initMap()
    this.populateData()
  }
}
