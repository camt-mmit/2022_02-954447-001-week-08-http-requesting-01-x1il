import { Injectable } from '@angular/core';
import { parsePeopleList } from '../helpers';
import { List, Person } from '../models';

 const url = 'https://swapi.dev/api/people';
@Injectable({
  providedIn: 'root'
})
export class PeopleFetchService {


  async getAll(): Promise<List<Person>> {
    const res = await fetch(url);
    return parsePeopleList(await res.json());
  }
}
