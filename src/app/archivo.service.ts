import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private archivoJson!: object;
  private archivoJson$: Subject<object>;
  constructor() {
    this.archivoJson$ = new Subject();
  }

  /**
   * setArchivoJson
   */
  public setArchivoJson(value: any) {
    var json = JSON.parse(value);
    this.archivoJson = json
    this.archivoJson$.next(this.archivoJson)
    //console.log(this.archivoJson)
  }

  /**
   * getArchivoJson
   */
  public getArchivoJson$(): Observable<object> {
    return this.archivoJson$.asObservable();
  }
}