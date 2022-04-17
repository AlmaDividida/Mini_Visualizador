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
<<<<<<< HEAD
=======
    //var json = JSON.parse(value);
>>>>>>> origin/Angel
    this.archivoJson = value;
    this.archivoJson$.next(this.archivoJson);
  }

  /**
   * getArchivoJson
   */
  public getArchivoJson$(): Observable<object> {
    return this.archivoJson$.asObservable();
  }
  
}
