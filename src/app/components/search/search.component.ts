import {Component, Input, OnInit} from '@angular/core'
import {FormControl} from '@angular/forms'

import {Observable} from 'rxjs'
import {map, startWith} from 'rxjs/operators'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('')
  @Input() options: string[] | undefined
  filteredOptions: Observable<string[]> | undefined

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map( ( value ) => {
        return this.filter(value || '')
      } ),
    )
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase()
    return this.options!.filter(option => option.toLowerCase().includes(filterValue))
  }
}