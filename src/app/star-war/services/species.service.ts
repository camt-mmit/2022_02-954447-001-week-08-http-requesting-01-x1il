import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { List, RawList, RawSpecie, Specie } from '../models';
import { parseSpecieList, parseSpecie } from '../helpers';
import { SearchData } from '../models';

const url = 'https://swapi.dev/api/species'

@Injectable({
  providedIn: 'root'
})
export class SpeciesService {

  constructor(private readonly http: HttpClient) { }
  
  getAll(SearchData: SearchData): Observable<List<Specie>>{
    return this.http
    .get<RawList<RawSpecie>>(url, {params:SearchData})
    .pipe(map((obj) => parseSpecieList(obj)));
  }
  get (id: string):Observable<Specie> {
    return this.http
      .get<RawSpecie>(`${url}/${id}`)
      .pipe(map((obj) => parseSpecie(obj)))
  }
}
