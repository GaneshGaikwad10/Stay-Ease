import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, retry } from "rxjs";


@Injectable({ providedIn: 'root' })

export class SearchCriteriaService {

  constructor(private http: HttpClient){}

  private apiUrl = 'http://localhost:3000/api/search';

  private criteria: any = null;

  setCriteria(c: any) { this.criteria = c; }
  
  getCriteria() { return this.criteria; }

  //to search hotel using search bar
  searchHotels(criteria: any):Observable<any>{
    return this.http.post<any[]>(this.apiUrl, criteria);
  }
}
