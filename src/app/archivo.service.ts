import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private archivoJson !: [string, object];

  constructor() { }

  /**
   * setArchivoJson
   */
  public setArchivoJson(value: any) {
    var json = JSON.parse(value);
    this.archivoJson = json
    //console.log(this.archivoJson)
  }

  /**
   * getArchivoJson
   */
  public getArchivoJson(): [string, object] {
    return this.archivoJson;
  }
}
